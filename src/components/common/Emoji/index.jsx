import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const dictionary = {
  bezlimit_inet: 'infinitInternet',
  bezlimit: 'infinitCalls',
  '10rub': 'tenRub',
};

export default function Emoji({ name, path, className }) {
  if (!name && !path) return null;

  const realName = dictionary[name] || name;
  const src = realName ? `https://static.beeline.ru/upload/images/emoji/${realName}.svg` : path;
  return (
    <img
      alt=""
      className={cx(className)}
      src={src}
      role="presentation"
    />
  );
}

Emoji.propTypes = {
  name: PropTypes.string,
  className: PropTypes.any,
  path: PropTypes.string,
};
