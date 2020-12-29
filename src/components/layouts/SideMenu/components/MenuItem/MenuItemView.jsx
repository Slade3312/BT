import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { GlobalIcon } from 'components/common';

export default function MenuItemView({
  title,
  href,
  bonusMessage,
  isActive,
  isAccessible,
  isFirst,
  isLast,
  icon,
  onClick,
  className,
  cx,
}) {
  return (
    <Link
      to={href || ''}
      className={cx(
        'component',
        {
          active: isActive,
          accessible: isAccessible,
          first: isFirst,
          last: isLast,
        },
        className,
      )}
      onClick={onClick}
    >
      <div className={cx('content')}>
        {bonusMessage && (
          <div className={cx('bonusMessage')}>
            <span className={cx('bonusMessageText')}>{bonusMessage}</span>
            <GlobalIcon slug="ticket" className={cx('ticket')} alt="bonus-ticket" />
          </div>
        )}
        {icon && <div className={cx('icon')}>{icon}</div>}

        <span className={cx('link')}>{title}</span>
      </div>
    </Link>
  );
}

MenuItemView.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  isActive: PropTypes.bool,
  isAccessible: PropTypes.bool,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  bonusMessage: PropTypes.string,
  cx: PropTypes.func,
};
