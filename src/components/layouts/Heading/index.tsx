/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

/**
 * Heading element configurable with size and adaptivity
 */
type Props = {
  tagName?: 'div', // override default tagName
  level?: 1 | 2 | 3 | 4 | 5 | 6, // 1(50), 2(41), 3(30), 4(21), 5(17)
  isBold?: boolean, // 1(50), 2(41), 3(30), 4(21), 5(17)
  className?: string | string[],
}

const Heading: React.FC<Props> = ({ children, level, tagName, className, isBold }) => {
  const Tag = tagName || `h${level}`;

  return (
    // @ts-ignore
    <Tag className={cx('component', {
        [`h${[level]}`]: level,
        bold: isBold,
      }, className)
    }>
      {children}
    </Tag>
  );
};

Heading.defaultProps = {
  level: 3,
};

export default Heading;

