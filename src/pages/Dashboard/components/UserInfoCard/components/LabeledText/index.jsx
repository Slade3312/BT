import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import FormFieldLabel from 'components/forms/FormFieldLabel';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const LabeledText = ({ label, children, isWarning, isSuccess, className }) => (
  <div className={cx('wrapper', className)}>
    <FormFieldLabel className={cx('label')}>{label}</FormFieldLabel>
    <FormFieldLabel className={cx('text', { warning: isWarning, success: isSuccess })}>
      {children || 'Не выбрано'}
    </FormFieldLabel>
  </div>
);

LabeledText.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  isWarning: PropTypes.bool,
  isSuccess: PropTypes.bool,
  className: PropTypes.string,
};

export default LabeledText;
