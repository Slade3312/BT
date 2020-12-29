import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { StoresContext } from 'store/mobx';
import GlobalIcon from 'components/common/GlobalIcon';
import PureButton from 'components/buttons/PureButton';
import TextareaAutosize from 'components/fields/TextareaAutosize';
import { OverlayLoader } from 'components/common/Loaders/components';
import PinnedFilesList from 'containers/ChatWidget/ChatWindow/components/PinnedFilesList';
import ExitButton from 'components/common/ExitButton';
import MultiFileUploadInput from 'components/fields/FileInputs/components/MultiFileUploadInput';
import { uploadFileToChatRequest } from 'requests/chat';
import { convertMbToBytes, passAsIs } from 'utils/fn';
import { DragAndDropAttachments } from 'components/fields';
import CustomPropTypes from 'utils/prop-types';
import EmojiPicker from 'components/common/EmojiPicker';
import { getCaretPosition } from 'utils/dom-helpers';
import MessagesListContainer from './containers/MessagesListContainer';
import MegaButtons from './containers/MegaButtons';
import styles from './styles.pcss';

const MAX_ATTACHMENT_SIZE_MB = 2;
const MAX_ATTACHMENTS_COUNT = 9;

const dragEndDropMessage = 'Перетащите выбранные файлы.\nРазмер одного вложения до 2 МБ. \nМаксимальное количество вложений 9.';

let isShiftPressed = false;

function ChatWindow({ className, setMessageScrollContainerNode, messagesScrollContainerNode }) {
  const { Chat } = useContext(StoresContext);

  /* save caret on: keydown, click on field, touch on field, when select emoji, change field */
  const helpCaretRef = useRef(Chat.message.length);

  const textAreaRef = useRef();
  const pinnedFilesInputRef = useRef();

  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const initWebSocketAgainIfClosedByServer = () => {
    if (Chat.webSocketConnector.checkIsPreviouslyClosedByServer()) {
      Chat.webSocketConnector.init();
    }
  };

  const handleMessageChange = (e) => {
    helpCaretRef.current = getCaretPosition(textAreaRef.current);

    initWebSocketAgainIfClosedByServer();

    Chat.set('message', e.target.value);
  };

  const handleMessageSend = async () => {
    const hasPinnedFiles = Chat.pinnedFiles.length > 0;

    if (Chat.message || hasPinnedFiles) {
      let filesIdsToSend = [];

      if (hasPinnedFiles) {
        Chat.set('isMessageSending', true);
        try {
          filesIdsToSend = await Promise.all(Chat.pinnedFiles.map(({ file }) =>
            uploadFileToChatRequest(file).then(({ id: fileId }) => fileId)));
        } catch (e) {
          Chat.set('attachmentsError', 'Проблема при загрузке некоторых вложений');
          return;
        } finally {
          Chat.set('isMessageSending', false);
        }
      }

      Chat.webSocketConnector.send({ message: Chat.message, files: filesIdsToSend });
    }

    Chat.set('message', '');
    Chat.set('pinnedFiles', []);
    Chat.set('attachmentsError', null);

    helpCaretRef.current = 0;

    requestAnimationFrame(() => {
      textAreaRef.current.focus();
    });
  };

  const handleKeyDown = e => {
    isShiftPressed = e.shiftKey;
  };

  const handleTouchEnd = () => {
    helpCaretRef.current = getCaretPosition(textAreaRef.current);
  };

  const handleKeyUp = () => {
    helpCaretRef.current = getCaretPosition(textAreaRef.current);

    isShiftPressed = false;
  };

  const handleKeyPress = (e) => {
    if (e.charCode === 13 && !isShiftPressed) {
      e.preventDefault();

      handleMessageSend();
    }
  };

  const handleClickUnreadMessages = () => {
    messagesScrollContainerNode.scrollTop = messagesScrollContainerNode.scrollHeight;
  };

  const handlePinFiles = (files) => {
    setEmojiPickerOpen(false);

    initWebSocketAgainIfClosedByServer();

    let maxSizeError = null;
    let maxCountError = null;

    const validFiles = [];

    // TODO pin only unique files

    const addValidFile = (validFile) => {
      if (validFiles.length + Chat.pinnedFiles.length < MAX_ATTACHMENTS_COUNT) {
        validFiles.push(validFile);
      }
    };

    files.forEach(file => {
      if (file.size > convertMbToBytes(MAX_ATTACHMENT_SIZE_MB)) {
        maxSizeError = 'Некоторые файлы не были прикреплены. Максимальный размер файла 2 МБ.';
      } else {
        addValidFile(file);
      }
    });

    if (files.length + Chat.pinnedFiles.length > MAX_ATTACHMENTS_COUNT) {
      maxCountError = `Максимальное количество вложений ${MAX_ATTACHMENTS_COUNT}.`;
    }

    if (maxSizeError || maxCountError) {
      Chat.set('attachmentsError', [maxSizeError, maxCountError].filter(passAsIs).join('\n'));
    } else {
      Chat.set('attachmentsError', null);
    }

    // pin only valid files
    Chat.addPinnedFiles(validFiles);

    requestAnimationFrame(() => {
      pinnedFilesInputRef.current.value = '';

      textAreaRef.current.focus();
      textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = helpCaretRef.current;
    });
  };

  const handleFileRemove = () => {
    Chat.set('attachmentsError', null);
  };

  const handleToggleEmoji = () => {
    setEmojiPickerOpen(prevState => !prevState);

    textAreaRef.current.focus();
    textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = helpCaretRef.current;
  };

  const handleSelectEmoji = (emojiSymbol) => {
    const characters = Array.from(Chat.message);
    const pickedString = Chat.message.slice(0, helpCaretRef.current);
    /* for surrogate emoji pairs we must ignore surrogate UTF-16 symbols */
    const normalizedLength = Array.from(pickedString).length;
    characters.splice(normalizedLength, 0, emojiSymbol);

    Chat.set('message', characters.join(''));

    /* new source length with added new surrogate symbols */
    helpCaretRef.current = `${pickedString}${emojiSymbol}`.length;

    requestAnimationFrame(() => {
      textAreaRef.current.focus();
      textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = helpCaretRef.current;
    });
  };

  const handleMessageClick = () => {
    helpCaretRef.current = getCaretPosition(textAreaRef.current);
  };

  useEffect(() => {
    textAreaRef.current.focus();
    textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = helpCaretRef.current;
  }, []);

  const isChatLoadingActive = Chat.isConnecting || Chat.isMessageSending;
  const isChatInterfaceLocked = Boolean(isChatLoadingActive || Chat.error);

  return (
    <section className={classNames(styles.window, className)}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleContainer}>
            <h5 className={styles.title}>Билайн Бизнес</h5>
            {Chat.settings.isWorkTime &&
            <span className={styles.subTitle}>
              Напишите ваше сообщение. Операторы онлайн!
            </span>
            }
          </div>

          <ExitButton
            className={styles.closeButton}
            onClick={() => Chat.set('isChatWidgetOpen', false)}
          />
        </div>
        <div className={styles.separator} />
      </header>


      <OverlayLoader className={styles.overlayLoader} isLoading={isChatLoadingActive}>
        <DragAndDropAttachments className={styles.attachments} disabled={isChatInterfaceLocked} onDropFiles={handlePinFiles} message={dragEndDropMessage} >
          <MessagesListContainer setMessageScrollContainerNode={setMessageScrollContainerNode} />

          <div className={styles.underListContent}>
            {Chat.notReadMessagesCount > 0 &&
              <div className={styles.notReadMessages} onClick={handleClickUnreadMessages}>
                <span>Есть непрочитанные сообщения ({Chat.notReadMessagesCount})</span>
              </div>
            }

            {!Chat.error && <MegaButtons />}

            {Chat.pinnedFiles.length > 0 && <PinnedFilesList onFileRemove={handleFileRemove} />}

            {Chat.attachmentsError && <div className={styles.attachmentsError}>{Chat.attachmentsError}</div>}

            <div className={styles.footer}>
              {!isChatInterfaceLocked && isEmojiPickerOpen &&
                <>
                  <EmojiPicker onSelect={handleSelectEmoji} className={styles.emojiPicker} />
                  <div className={classNames(styles.separator, styles.emojiSeparator)} />
                </>
              }

              <div className={styles.userMessageContainer}>
                <PureButton onClick={handleToggleEmoji} className={classNames(styles.emojiButton, isChatInterfaceLocked && styles.disabled)}>
                  <GlobalIcon slug="emojiSmile" className={styles.emojiIcon} />
                </PureButton>

                <TextareaAutosize
                  ref={textAreaRef}
                  onKeyPress={handleKeyPress}
                  onKeyDown={handleKeyDown}
                  onTouchEnd={handleTouchEnd}
                  onKeyUp={handleKeyUp}
                  className={classNames(styles.textField, isChatInterfaceLocked && styles.disabled)}
                  value={Chat.message}
                  placeholder={Chat.isConnecting ? 'Идёт подключение к чату...' : 'Напишите сообщение...'}
                  onChange={handleMessageChange}
                  onClick={handleMessageClick}
                  maxHeight={150}
                  maxLength={2000}
                  disabled={isChatInterfaceLocked}
              />
                <div className={styles.buttonControls}>
                  <PureButton
                    disabled={isChatInterfaceLocked}
                    className={classNames(styles.buttonSend, isChatInterfaceLocked && styles.disabled)}
                    onClick={handleMessageSend}
                  >
                    <GlobalIcon className={styles.iconSend} slug="strokeRightArrow" />
                  </PureButton>

                  <label className={classNames(styles.buttonAttachLabel, isChatInterfaceLocked && styles.disabled)}>
                    <MultiFileUploadInput ref={pinnedFilesInputRef} onChange={handlePinFiles}>
                      <div className={styles.buttonAttachWrapper}>
                        <GlobalIcon className={styles.buttonAttach} slug="clip" />
                      </div>
                    </MultiFileUploadInput>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </DragAndDropAttachments>
      </OverlayLoader>
    </section>
  );
}

ChatWindow.propTypes = {
  className: PropTypes.string,
  setMessageScrollContainerNode: PropTypes.func,
  messagesScrollContainerNode: CustomPropTypes.ref,
};

export default observer(ChatWindow);
