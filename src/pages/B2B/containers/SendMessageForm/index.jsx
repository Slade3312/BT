import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';

import { ActionButton } from 'components/buttons';

import FileClipIcon from '../../assets/fileClip.svg';
import styles from './styles.pcss';

function SendMessageForm() {
  const { TinderChat } = useContext(StoresContext);

  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessageClick = () => {
    if (TinderChat.previewFilesToSend.length) {
      TinderChat.loadCurrentFiles(message);
    } else if (message.length) {
      TinderChat.webSocketConnector.send({
        message,
        send_to: TinderChat.activeChat.interlocutor,
        user_message: true,
      });
    }

    setMessage('');
  };

  const handleFileChange = (e) => {
    const newFiles = e.target.files;

    for (let i = 0; i < newFiles.length; i++) {
      const formData = new FormData();
      formData.append('file', newFiles.item(i));

      if (newFiles.item(i).type.indexOf('image') !== -1) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(newFiles.item(i));

        fileReader.onload = () => {
          TinderChat.addPreviewFile({
            file: formData,
            name: newFiles.item(i).name,
            url: fileReader ? fileReader.result : '',
            id: `${newFiles.item(i).lastModified}-${newFiles.item(i).name}`,
          });
        };
      } else {
        TinderChat.addPreviewFile({
          file: formData,
          name: newFiles.item(i).name,
          id: `${newFiles.item(i).lastModified}-${newFiles.item(i).name}`,
          extension: newFiles.item(i).name.split('.').pop(),
        });
      }
    }
  };

  const pressedKeys = {};

  const handleKeyDown = (event) => {
    pressedKeys[event.key] = true;

    if (pressedKeys.Enter && pressedKeys.Shift) {
      return false;
    }

    if (event.code === 'Enter' || event.key === 'Enter') {
      event.preventDefault();

      handleSendMessageClick();
      return false;
    }

    return true;
    /*
    else {
      if (!isTyping) postTyping(1);
      setIsTyping(true);
    }
    */
  };

  const handleKeyUp = (event) => {
    pressedKeys[event.key] = false;
  };


  return (
    <form className={styles.form}>
      <textarea
        value={message}
        placeholder="Напишите сообщение..."
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus
        className={styles.textarea}
      />

      <label className={styles.fileButton}>
        <input
          key={`${TinderChat.previewFilesToSend.length}-loadFiles`}
          type="file"
          onChange={handleFileChange}
          multiple
          className={styles.fileInput}
        />

        <FileClipIcon />
      </label>

      <ActionButton
        className={styles.sendButton}
        type="button"
        iconSlug="arrowRightMinimal"
        onClick={handleSendMessageClick}
        disabled={message.length === 0 && TinderChat.previewFilesToSend.length === 0}
      >
        Отправить
      </ActionButton>
    </form>
  );
}

export default observer(SendMessageForm);
