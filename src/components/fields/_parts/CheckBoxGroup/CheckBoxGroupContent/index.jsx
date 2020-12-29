import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';
import styles from 'components/fields/_parts/CheckBoxGroup/CheckBoxGroupContent/styles.pcss';
import { CheckBoxPropsTypes } from 'components/fields/_parts/CheckBoxGroup/helpers/check-box-props-types';

const cx = classNames.bind(styles);

const CheckBoxGroupContent = ({ options, values, renderParentCheckbox, renderOptionCheckbox, forwardedRef }) => (
  <div className={cx('container')} ref={forwardedRef}>
    <div className={cx('parentCheckbox')}>{renderParentCheckbox({ values })}</div>
    <div className={cx('options')}>
      {options.map(({ id, label: lab, tooltip }) => (
        <Fragment key={id}>{renderOptionCheckbox({ id, label: lab, tooltip })}</Fragment>
        ))}
    </div>
  </div>
);

CheckBoxGroupContent.propTypes = {
  options: CheckBoxPropsTypes.options,
  values: CheckBoxPropsTypes.value,
  renderParentCheckbox: CustomPropTypes.component,
  renderOptionCheckbox: CustomPropTypes.component,
  forwardedRef: CustomPropTypes.ref,
};

export default withForwardedRef(CheckBoxGroupContent);
