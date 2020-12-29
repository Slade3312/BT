import React from 'react';
import PropTypes from 'prop-types';
import operatorDefaultAva from 'images/operator.png';
import MessageContainer from 'containers/ChatWidget/ChatWindow/components/MessageContainer';
import styles from './styles.pcss';

function ManagerMessage({
  text,
  time,
  manager,
  isTyping,
  files,
  isHideAvatar,
}) {
  return (
    <li className={styles.component}>
      <div className={styles.avaCol}>
        {!isHideAvatar && (
          <>
            <img
              src={manager.photoSrc ? manager.photoSrc : operatorDefaultAva}
              alt={manager.name}
              className={styles.avatar}
            />
            <span className={styles.managerName}>{manager.name}</span>
          </>
        )}
      </div>

      <div className={styles.messageCol}>
        {!isTyping ? (
          <>
            <MessageContainer text={text} files={files} isPrimary />
            <div className={styles.timeCol}>
              <span className={styles.time}>{time}</span>
            </div>
          </>
        ) : (
          <div className={styles.typingIndicatorWrapper}>
            <div className={styles.indicator} />
            <div className={styles.indicator} />
            <div className={styles.indicator} />
          </div>
        )}
      </div>
    </li>
  );
}

ManagerMessage.propTypes = {
  text: PropTypes.string,
  time: PropTypes.string,
  manager: PropTypes.shape({
    photoSrc: PropTypes.string,
    name: PropTypes.string,
  }),
  isTyping: PropTypes.bool,
  files: PropTypes.array,
  isHideAvatar: PropTypes.bool,
};

export default ManagerMessage;
