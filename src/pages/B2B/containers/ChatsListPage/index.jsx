import React, { useContext, useEffect, useRef } from 'react';
import { Link, Router } from '@reach/router';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import GlobalIcon from 'components/common/GlobalIcon';
import Heading from 'components/layouts/Heading';
import { Preloader } from 'components/common';
import { TINDER_URL } from 'pages/constants';

import ChatsListRow from '../../components/ChatsListRow';
import ActiveChatPage from '../ActiveChatPage';

import styles from './styles.pcss';

function ChatsListPage() {
  const listRef = useRef();
  const { TinderChat } = useContext(StoresContext);

  useEffect(() => {
    TinderChat.loadChatsList();
    return () => {
      TinderChat.loadAllChatsUnreadCount();
      TinderChat.set('chatsList', []);
    };
  }, []);

  useEffect(() => {
    TinderChat.loadChatsList();
  }, [TinderChat.activeChat.id]);

  return (
    <section ref={listRef} className={styles.chatsListContainer}>
      <div className={styles.contentContainer}>
        <Link to={TINDER_URL}className={styles.backLink}>
          <GlobalIcon slug="arrowLeftBack" className={styles.arrow} />

          Главный экран
        </Link>

        <Heading level={2} className={styles.title}>Сообщения</Heading>
        {
          !TinderChat.chatsList.length &&
          !TinderChat.isChatsLoading &&
          <div className={styles.emptyHolder}>У вас пока нет сообщений</div>
        }
        <ul className={styles.chatsList}>
          {TinderChat.chatsList.map(chat => (
            <ChatsListRow
              id={chat.id}
              key={chat.id}
              name={chat.dialog_name}
              lastMessage={chat.last_message}
              unreadCount={chat.unread_count + (chat?.newMessages?.length || 0)}
              createdTime={chat.created_date}
            />
          ))}

          {TinderChat.isChatsLoading && <Preloader />}
        </ul>
      </div>
      <Router primary={false}>
        <ActiveChatPage path=":id" listElem={listRef} />
      </Router>
    </section>
  );
}

export default observer(ChatsListPage);
