import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Heading from 'components/layouts/Heading';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function SubHeadline({ children, className }) {
  return (
    <Heading tagName="div" level={5} className={cx('component', className)}>
      {children}
    </Heading>
  );
}

SubHeadline.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
