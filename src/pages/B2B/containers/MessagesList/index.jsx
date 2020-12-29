import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { Preloader, BeautyScrollbar } from 'components/common';

import SystemMessage from '../../components/SystemMessage';
import DateMessage from '../../components/DateMessage';
import SendedMessage from '../../components/SendedMessage';
import GettedMessage from '../../components/GettedMessage';
import { getFormattedDate, getFormattedTime, getArrayWithDateElements } from '../../utils';

import styles from './styles.pcss';

function MessagesList() {
  const listRef = useRef();
  const loaderRef = useRef();

  const { TinderChat, UserInfo: { getUserInfoCompany } } = useContext(StoresContext);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (TinderChat.newMessage.id && !isScrolled) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [TinderChat.newMessage.id, TinderChat.activeChat.id]);

  useEffect(() => {
    // в самом начале ставим скролл в самый низ
    if (!isScrolled && listRef.current.scrollTop === 0) {
      // для изменения напрямую элементов ДОМ дерева, при работе с функцион. компонентами
      requestAnimationFrame(() => {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      });
    }
  }, [TinderChat.activeChatMessagesList.length]);

  useEffect(() => {
    // IntersectionObserver - для фиксации момента прокручивания до верха списка сообщений
    const addHistoryWatcher = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && TinderChat.nextLoadMessagesUrl) {
          const prevScrollHeight = listRef.current.scrollHeight;

          await TinderChat.loadMessagesHistory(TinderChat.nextLoadMessagesUrl);

          const prevRestToTop = listRef.current.scrollTop;

          /* notice, that next lazy load observe reaching of not last message item */
          /* and we must calculate really distance to the top (we save not only previous scrollHeight) */
          requestAnimationFrame(() => {
            listRef.current.scrollTop = listRef.current.scrollHeight - prevScrollHeight + prevRestToTop;
          });
        }
      },
      { threshold: 0.5, root: null },
    );

    // для изменения напрямую элементов ДОМ дерева, при работе с функцион. компонентами
    requestAnimationFrame(() => {
      addHistoryWatcher.observe(loaderRef.current);
    });

    return () => {
      if (addHistoryWatcher) addHistoryWatcher.disconnect();
    };
  }, []);

  const handleMessagesListScroll = (e) => {
    const curScrollBottom = e.target.scrollHeight
      - e.target.scrollTop
      - e.target.getBoundingClientRect().height;

    if (e.target.scrollTop > 10 || curScrollBottom > 10) {
      setIsScrolled(true);
    }

    if (curScrollBottom < 10 && (e.target.scrollTop > e.target.scrollHeight / 2)) setIsScrolled(false);
  };

  return (
    <BeautyScrollbar
      className={styles.messagesList}
      ref={listRef}
      onScroll={handleMessagesListScroll}
      autoHide={false}
    >
      {(TinderChat.nextLoadMessagesUrl || TinderChat.isMessagesLoading) && !TinderChat.activeChatError && (
        <li className={styles.loaderElement}><Preloader /></li>
      )}

      <li ref={loaderRef} />

      {!TinderChat.chatError &&
        getArrayWithDateElements(TinderChat.activeChatMessagesList).map((message, index, mappedArray) => {
          if (message.isDateMessage) {
            return <DateMessage key={message.id} text={getFormattedDate(message.message)} />;
          }
          if (message.sender === getUserInfoCompany().id) {
            return (
              <SendedMessage
                key={message.id}
                text={message.message}
                time={getFormattedTime(message.date_time_message)}
                user={ {
                  name: message.sender_name,
                  photo: message.photo,
                  companionId: message.sender,
                } }
                imageUrl={message.imageUrl}
                fileUrl={message.fileUrl}
                fileExtension={message.fileExtension}
              />
            );
          } else if (message.sender !== getUserInfoCompany().id && !message.isDateMessage) {
            return (
              <GettedMessage
                key={message.id}
                isSimple={
                  index < mappedArray.length - 1 &&
                  mappedArray[index + 1].sender === getUserInfoCompany().id &&
                  !mappedArray[index + 1].isDateMessage
                }
                text={message.message}
                time={getFormattedTime(message.date_time_message)}
                imageUrl={message.imageUrl}
                fileUrl={message.fileUrl}
                interlocutor={message.sender}
                fileExtension={message.fileExtension}
              />
            );
          }
          return {};
        })}

      {TinderChat.chatError && <SystemMessage text={TinderChat.chatError} isError />}
    </BeautyScrollbar>
  );
}

export default observer(MessagesList);
