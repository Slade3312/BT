import React, { useContext, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withForwardedRef } from 'enhancers';
import { StoresContext } from 'store/mobx';
import operatorDefaultAva from 'images/operator.png';
import PreloaderImage from 'components/common/Preloader/image.svg';
import { BeautyScrollbar } from 'components/common';
import { ManagerMessage, SystemMessage } from 'containers/ChatWidget/ChatWindow/components';
import { USER_SCROLL_TO_SAVE_LIMIT } from 'containers/ChatWidget/constants';
import { getFormattedChatTime } from 'containers/ChatWidget/utils';
import MessagesElements from '../MessagesElements';
import styles from './styles.pcss';

let savedChatScrollPos = null;

function MessagesListContainer({ setMessageScrollContainerNode }) {
  const { Chat } = useContext(StoresContext);

  const firstItemRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const handleReachTopDetection = async () => {
    if (Chat.nextUrl) {
      const prevScrollHeight = scrollContainerRef.current.scrollHeight;

      await Chat.loadMessagesHistory();

      const prevRestToTop = scrollContainerRef.current.scrollTop;

      /* notice, that next lazy load observe reaching of not last message item */
      /* and we must calculate really distance to the top (we save not only previous scrollHeight) */
      requestAnimationFrame(() => {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight - prevScrollHeight + prevRestToTop;
      });
    }
  };

  useEffect(() => {
    const intersectionObs = new IntersectionObserver(
      async (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting) {
          Chat.resetNotReadMessages();
        }
      },
      { threshold: 1.0, root: null },
    );

    requestAnimationFrame(() => {
      intersectionObs.observe(firstItemRef.current);
    });

    return () => {
      intersectionObs.disconnect();
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollContainerRef.current.scrollTop = savedChatScrollPos ?? scrollContainerRef.current.scrollHeight;
      setMessageScrollContainerNode(scrollContainerRef.current);
    });

    return () => {
      // restore scroll to bottom if we did't scrolled more than limit before closing chat
      if (scrollContainerRef.current.scrollHeight - scrollContainerRef.current.getBoundingClientRect().height - scrollContainerRef.current.scrollTop > USER_SCROLL_TO_SAVE_LIMIT) {
        savedChatScrollPos = scrollContainerRef.current.scrollTop;
      } else {
        savedChatScrollPos = null;
      }
    };
  }, []);

  return (
    <BeautyScrollbar className={styles.scrollContainer} ref={scrollContainerRef} >
      {Chat.messages.length > 5 && !Chat.error && Chat.nextUrl && <li className={styles.loaderRow}>
        <PreloaderImage className={styles.animated} />
      </li>}

      {!Chat.error && <MessagesElements onReachTopDetection={handleReachTopDetection} />}

      {Chat.error && <SystemMessage text={Chat.error} isError />}

      <div ref={firstItemRef} />

      {Chat.chatTypingMessage &&
      <ManagerMessage
        key="typing-message"
        isTyping
        time={getFormattedChatTime(Date.now())}
        manager={{ name: Chat.chatTypingMessage.sender_name, photoSrc: Chat.chatTypingMessage.photo || operatorDefaultAva }}
          />
        }
    </BeautyScrollbar>
  );
}

MessagesListContainer.propTypes = {
  setMessageScrollContainerNode: PropTypes.func,
};

export default withForwardedRef(observer(MessagesListContainer));
