import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Heading from 'components/layouts/Heading';
import GlobalIcon from 'components/common/GlobalIcon';

import { getFormattedDate, getTodayDate, getFormattedTime } from '../../utils';
import styles from './styles.pcss';

export default function ChatsListRow({ name, id, lastMessage, unreadCount, createdTime = '' }) {
  const getDateOrTime = () => getFormattedDate(createdTime) === getTodayDate
    ? getFormattedTime(createdTime)
    : getFormattedDate(createdTime);

  return (
    <li>
      <Link to={`${id}`} className={styles.listRow}>
        <div className={styles.textContainer}>
          <Heading level={4}>{name}</Heading>

          <p className={styles.lastMessage}>{lastMessage}</p>
        </div>

        {unreadCount !== 0 && <div className={styles.unreadCount}>{unreadCount}</div>}

        <GlobalIcon slug="arrowRightMinimal" className={styles.arrowIcon} />

        <span className={styles.createdTime}>{getDateOrTime()}</span>
      </Link>
    </li>
  );
}

ChatsListRow.propTypes = {
  name: PropTypes.string,
  lastMessage: PropTypes.string,
  createdTime: PropTypes.string,
  unreadCount: PropTypes.number,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

