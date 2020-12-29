import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Heading } from 'components/layouts';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function DescriptionWrapper({ children, className, level }) {
  return (
    <Heading level={level} className={cx('content', className)}>
      {children}
    </Heading>
  );
}

DescriptionWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  level: PropTypes.number,
};
