import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Emoji from '../Emoji';

import GlobalIcon from '../GlobalIcon';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Status = (props) => {
  const { children, emoji, text, className } = props;

  return (
    <div className={cx('wrapper', className)}>
      {emoji && (
        <div className={cx('emoji')}>
          <Emoji className={cx('emojiImage')} name={emoji} />
        </div>
      )}
      {className && className.indexOf('success') > -1 && (
        <GlobalIcon
          className={cx('icon')}
          slug="checked"
        />
      )}
      <div className={cx('content')}>
        { children }
        { text && <span dangerouslySetInnerHTML={{ __html: text }} /> }
      </div>
    </div>
  );
};

Status.propTypes = {
  emoji: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  text: PropTypes.string,
};

export default Status;
