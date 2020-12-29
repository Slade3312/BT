import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from '@reach/router';
import animateScrollTo from 'animated-scroll-to';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { webNotifications } from 'modules';
import { StoresContext } from 'store/mobx';
import PureButton from 'components/buttons/PureButton';
import ChatWindow from 'containers/ChatWidget/ChatWindow';
import PushStack from 'containers/ChatWidget/ChatWindow/components/PushStack';
import WebSocketChatConnector from 'containers/WebSocketChatConnector';
import operatorDefaultAva from 'images/operator.png';
import { USER_SCROLL_TO_SAVE_LIMIT } from 'containers/ChatWidget/constants';
import { checkIsOperatorMessage, checkIsUserMessage } from '../WebSocketChatConnector/utils';
import BotTooltip from './BotTootip';
import ChatIcon from './chat.svg';
import styles from './styles.pcss';

let timerBotMessageToShow = null;

const defaultNotification = {
  author: 'Билайн бизнес',
  message: 'Здравствуйте! Мы можем создать кампанию за вас. Наш специалист ответит на любые вопросы в чате.',
  type: 'defaultMessage',
};

const typingTypes = {
  startTyping: 'startTyping',
  stopTyping: 'stopTyping',
};

function ChatWidget() {
  const location = useLocation();
  const { Chat, Templates } = useContext(StoresContext);

  const [messagesScrollContainerNode, setMessageScrollContainerNode] = useState(null);

  const [isActiveQuickTip, setIsActiveQuickTip] = useState(false);

  const handleOpenChat = () => {
    webNotifications.checkAndRequestPermissions();

    Chat.set('isChatWidgetOpen', !Chat.isChatWidgetOpen);
    Chat.removeAllNotifications();
    clearTimeout(timerBotMessageToShow);
  };

  const handleReceiveTextMessage = (data) => {
    const message = data.data;

    Chat.addNewMessage(message);

    const isUserMessage = checkIsUserMessage(message);

    if (!isUserMessage) {
      let pushAvatar = null;

      if (message.operator_message) {
        pushAvatar = message.photo || operatorDefaultAva;
      }

      Chat.pushNotification({ author: message.sender_name, message: message.message, avatar: pushAvatar });
    }
  };

  const moveListScrollToBottom = () => {
    if (messagesScrollContainerNode) {
      animateScrollTo(Infinity, {
        elementToScroll: messagesScrollContainerNode,
        maxDuration: 500,
        minDuration: 250,
      });
    }
  };

  const handleReceiveAnyMessage = (data) => {
    const message = data.data;

    const isUserMessage = checkIsUserMessage(message);
    const isTypingMessage = data.method === typingTypes.startTyping || data.method === typingTypes.stopTyping;

    const addNotReadMessages = () => {
      if (!isTypingMessage) {
        Chat.addNotReadMessageCount();
      }
    };

    if (Chat.isChatWidgetOpen) {
      /* scroll settling and unread messages count that are not visible in chat viewport */
      if (messagesScrollContainerNode) {
        const curScrollBottom = messagesScrollContainerNode.scrollHeight - messagesScrollContainerNode.scrollTop - messagesScrollContainerNode.getBoundingClientRect().height;

        requestAnimationFrame(() => {
          if (curScrollBottom < USER_SCROLL_TO_SAVE_LIMIT || isUserMessage) {
            moveListScrollToBottom();
          } else {
            addNotReadMessages();
          }
        });
      }
    } else {
      addNotReadMessages();
    }
  };

  const handleReceiveTypingMessage = (data) => {
    if (data.method === typingTypes.startTyping) {
      Chat.set('chatTypingMessage', data.data);
    }
    if (data.method === typingTypes.stopTyping) {
      Chat.set('chatTypingMessage', null);
    }
  };

  const handleReceiveSocketMessage = (data) => {
    const message = data.data;

    if (!data.method || data.method === 'newMessage') {
      handleReceiveTextMessage(data);

      if (Chat.chatTypingMessage && checkIsOperatorMessage(message)) {
        Chat.set('chatTypingMessage', null);
      }
    } else if ((data.method === typingTypes.startTyping || data.method === typingTypes.stopTyping) && !checkIsUserMessage(message)) {
      handleReceiveTypingMessage(data);
    }

    handleReceiveAnyMessage(data);
  };

  const scheduleDefaultChatNotification = () => {
    const isDefaultChatNotificationConfirmed = localStorage.getItem('isDefaultChatNotificationConfirmed');

    if (!isDefaultChatNotificationConfirmed && !timerBotMessageToShow) {
      timerBotMessageToShow = setTimeout(() => {
        if (!Chat.hasSomeUserMessage && location.pathname.indexOf('/audience-statistic') === -1) {
          Chat.pushNotification(defaultNotification);
          Chat.persistDefaultNotificationConfirmed();
        }
      }, 10000);
    }
  };

  async function handleWebsocketChatOpen() {
    Chat.resetChatMessagesAndHistory();
    await Chat.loadMessagesHistory();

    Chat.set('isConnecting', false);

    scheduleDefaultChatNotification();

    requestAnimationFrame(() => {
      moveListScrollToBottom();
    });
  }

  function handleWebsocketInit() {
    Chat.set('isConnecting', true);
  }

  function handleWebsocketError() {
    Chat.set('isConnecting', false);
    Chat.set('chatTypingMessage', null);
  }

  function handleWebsocketClose() {
    Chat.set('isConnecting', false);
    Chat.set('chatTypingMessage', null);
  }

  function handleWebsocketPreReconnect() {
    Chat.set('isConnecting', true);
  }

  function handleWebsocketReconnectLimitReached() {
    Chat.set('error', 'Что-то пошло не так. Не можем подключиться к чату после нескольких попыток. Пожалуйста, перезагрузите страницу.');
  }


  useEffect(() => {
    Templates.getTemplate('chat');
  }, [Chat.notifications.length]);

  useEffect(() => {
    if (location.pathname.indexOf('/audience-statistic') !== -1) {
      clearTimeout(timerBotMessageToShow);
    }
  }, [location.pathname]);

  const handleInteraction = () => {
    Chat.notifications.forEach(element => {
      Chat.delayedRemoveNotification(element);
    });
  };

  useEffect(() => {
    // detect any user interaction to hide all notifications
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (!Chat.settings.isLoaded) {
      Chat.loadChatSettings();
    }
  }, []);

  const isOpenHelpChatTooltip = isActiveQuickTip && !Chat.isChatWidgetOpen && !Chat.notifications.length;

  return (
    <WebSocketChatConnector
      onMessage={handleReceiveSocketMessage}
      onInit={handleWebsocketInit}
      onOpen={handleWebsocketChatOpen}
      onError={handleWebsocketError}
      onClose={handleWebsocketClose}
      onPreReconnect={handleWebsocketPreReconnect}
      onReconnectLimitReached={handleWebsocketReconnectLimitReached}
    >
      <div
        onMouseEnter={() => setIsActiveQuickTip(true)}
        onMouseLeave={() => setIsActiveQuickTip(false)}
        className={classNames(styles.chatButtonWrapper, Chat.settings.isLoading && styles.loading)}
      >
        <PureButton
          className={styles.chatButton}
          onClick={handleOpenChat}
        >
          <ChatIcon className={styles.chatIcon} />
        </PureButton>
        {Chat.notReadMessagesCount > 0 && <div className={styles.notReadMessagesInfo}>{Chat.notReadMessagesCount}</div>}
      </div>

      <BotTooltip
        isOpen={isOpenHelpChatTooltip}
        className={styles.botTooltip}
        content="Задайте свой вопрос в чате"
        author="Билайн Бизнес"
        isSkipCloseDelay={!isActiveQuickTip}
      />

      <PushStack onItemClick={Chat.removeNotification} onItemClose={Chat.removeNotification} items={Chat.notifications} />

      {Chat.isChatWidgetOpen && <ChatWindow
        setMessageScrollContainerNode={setMessageScrollContainerNode}
        messagesScrollContainerNode={messagesScrollContainerNode}
        className={styles.chatWidget}
      />}
    </WebSocketChatConnector>
  );
}

export default observer(ChatWidget);
