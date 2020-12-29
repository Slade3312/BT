import React, { useEffect, useContext } from 'react';
import { Link } from '@reach/router';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import GlobalIcon from 'components/common/GlobalIcon';
import Heading from 'components/layouts/Heading';

import MessagesList from '../MessagesList';
import SendMessageForm from '../SendMessageForm';
import FilesPreview from '../FilesPreview';

import styles from './styles.pcss';

function ActiveChatPage({ id, listElem }) {
  const { TinderChat } = useContext(StoresContext);

  useEffect(() => {
    TinderChat.setActiveChat('id', id);

    if (!isNaN(id)) {
      if (!TinderChat.activeChat.interlocutor || !TinderChat.activeChat.name) {
        TinderChat.loadGetChatById({ id, isActive: true });
      }

      TinderChat.loadReadedMessages(id);
      TinderChat.loadMessagesHistory(TinderChat.nextLoadMessagesUrl);
    }

    return () => {
      TinderChat.set('activeChatMessagesList', []);
      TinderChat.set('activeChat', { id: '', interlocutor: null, name: TinderChat.activeChat.name || '' });
      TinderChat.set('nextLoadMessagesUrl', '');
    };
  }, [id]);

  useEffect(() => {
    if (listElem.current) {
      listElem.current.scrollTop = 0;
      listElem.current.style.overflow = 'hidden';
    }

    return () => {
      listElem.current.style.overflow = 'auto';
    };
  }, [listElem.current]);

  return (
    <section className={styles.chatsListContainer}>
      <div className={styles.contentContainer}>
        <Link to="/beetogether/chats" className={styles.backLink} onClick={() => TinderChat.loadReadedMessages(id) }>
          <GlobalIcon slug="arrowLeftBack" className={styles.arrow} />

          Сообщения
        </Link>

        <Heading level={2} className={styles.title}>{TinderChat.activeChat.name}</Heading>

        <div className={styles.relativeHeight}>
          <MessagesList />

          {TinderChat.loadFilesError && <div className={styles.loadFilesError}>{TinderChat.loadFilesError}</div>}
          <FilesPreview />
        </div>

        <SendMessageForm />
      </div>
    </section>
  );
}

ActiveChatPage.propTypes = {
  id: PropTypes.string,
  listElem: PropTypes.node,
};

export default observer(ActiveChatPage);
