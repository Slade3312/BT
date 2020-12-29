import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import DefaultAvatar from './assets/avatar.svg';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const alt = 'User avatar';

const Avatar = ({ height = '60px', width = '60px', src }) => (
  <div style={{ height, width }}>
    {src ? (
      <img className={cx('image')} alt={alt} />
    ) : (
      <DefaultAvatar />
    )}
  </div>
);

Avatar.propTypes = {
  src: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
};

export default Avatar;
