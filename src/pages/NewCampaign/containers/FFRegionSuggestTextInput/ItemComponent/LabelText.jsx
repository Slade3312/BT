import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const LabelText = ({ children, isBold }) =>
  <span className={cx({ bold: isBold })}>{children}</span>;

LabelText.propTypes = {
  children: PropTypes.node,
  isBold: PropTypes.bool,
};

export default LabelText;
