import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Heading } from 'components/layouts';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function FaqTitle({ children, className }) {
  return (
    <Heading level={3} className={cx('component', className)}>{children}</Heading>
  );
}

FaqTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
