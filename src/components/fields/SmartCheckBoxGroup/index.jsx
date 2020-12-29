import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import { withForwardedRef } from 'enhancers';
import { withError } from 'components/fields/TextInput/enhancers';
import { CheckBoxGroup } from '../_parts';
import { CheckBoxPropsTypes } from '../_parts/CheckBoxGroup/helpers/check-box-props-types';

const SmartCheckBoxGroup = ({ value, onChange, name, options, forwardedRef, label, tooltip }) => {
  const curValue = value || [];

  const getAllPossibleValues = () => options.map(({ id }) => id);

  const handleChangeGroupCheckbox = (_, e) => {
    if (curValue.length !== 0) {
      onChange(null, e);
    } else {
      onChange(getAllPossibleValues(), e);
    }
  };

  const handleChangeOptionCheckbox = (nextValue, e) => {
    const { name: curName } = e.target;

    if (nextValue) {
      onChange([...curValue, curName]);
    } else {
      const nextVal = curValue.filter(curVal => curVal !== curName);
      onChange(nextVal.length ? nextVal : null);
    }
  };

  return (
    <CheckBoxGroup
      tooltip={tooltip}
      ref={forwardedRef}
      values={curValue}
      onChangeGroup={handleChangeGroupCheckbox}
      onChangeOption={handleChangeOptionCheckbox}
      name={name}
      label={label}
      options={options}
    />
  );
};

SmartCheckBoxGroup.propTypes = {
  value: CheckBoxPropsTypes.value,
  options: CheckBoxPropsTypes.options,
  onChange: PropTypes.func,
  forwardedRef: CustomPropTypes.ref,
  name: PropTypes.string,
  label: PropTypes.string,
  tooltip: PropTypes.string,
};

export default withError(withForwardedRef(SmartCheckBoxGroup));
