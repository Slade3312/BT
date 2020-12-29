import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { GlobalIcon } from 'components/common';
import styles from './styles.pcss';

export default function BotTooltip({
  className,
  isOpen,
  content,
  onClick,
  onClose,
  isSkipCloseDelay,
  author,
  avatar,
}) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        styles.component,
        isOpen && styles.open,
        isSkipCloseDelay && styles.forceClose,
        className,
      )}
    >
      {onClose && (
        <GlobalIcon
          onClick={onClose}
          slug="cross"
          className={styles.closeButton}
        />
      )}

      {avatar &&
        <div className={styles.avatarWrapper}>
          <img className={styles.avatar} src={avatar} alt="pushAvatar" />
        </div>
      }

      <div className={styles.textWrapper}>
        <div className={styles.title}>{author}</div>
        <div>{content}</div>
      </div>
    </div>
  );
}

BotTooltip.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.string,
  isOpen: PropTypes.bool,
  isSkipCloseDelay: PropTypes.bool,
  content: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  author: PropTypes.string,
};
