import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import FormFieldLabel from 'components/forms/FormFieldLabel';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const LabeledText = ({ label, children, className }) => (
  <div className={cx('wrapper', className)}>
    <FormFieldLabel className={cx('label')}>{label}</FormFieldLabel>

    <FormFieldLabel className={cx('text')}>
      {children}
    </FormFieldLabel>
  </div>
);

LabeledText.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default LabeledText;
