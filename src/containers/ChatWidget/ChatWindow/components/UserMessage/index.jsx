import React from 'react';
import PropTypes from 'prop-types';
import MessageContainer from 'containers/ChatWidget/ChatWindow/components/MessageContainer';
import styles from './styles.pcss';

function UserMessage({ text, time, files }) {
  return (
    <li className={styles.component}>
      <div className={styles.timeCol}>{time && <div className={styles.time}>{time}</div>}</div>
      <MessageContainer text={text} files={files} />
    </li>
  );
}

UserMessage.propTypes = {
  text: PropTypes.string,
  time: PropTypes.string,
  files: PropTypes.array,
};

export default UserMessage;
