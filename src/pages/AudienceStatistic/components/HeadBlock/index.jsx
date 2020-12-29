import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function HeadBlock({
  className,
  title,
  description,
  ticketMessage,
}) {
  return (
    <div className={cx('component', className)}>
      <h2 className={cx('title')}>
        {ticketMessage && (
          <div className={styles.ticketWrapper}>
            <GlobalIcon slug="ticket" className={styles.ticket} />
            <span className={styles.ticketText}>{ticketMessage}</span>
          </div>
        )}
        <span>{title}</span>
      </h2>
      <div className={cx('description')}>{description}</div>
    </div>
  );
}

HeadBlock.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  ticketMessage: PropTypes.string,
};
