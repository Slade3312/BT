import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import FormField from 'components/forms/FormField';
import { allowParamOmit } from 'utils/decorators';

/**
 * Wrapper adds `label` and `isValid` indicator
 */
const withWrapper = ({
  labelSide = null,
  isLight = false,
} = {}) => (WrappedInput) => {
  function InputWithWrapper(props) {
    const {
      label,
      tooltip,
      isValid,
      forwardedRef,
      className,
      isNullLabel,
      isLeftLabel,
      isSecondaryLabel,
      isSmallLabel,
      isBaseField,
      tooltipPositionType,
      isInline,
      ...otherProps
    } = props;
    return (
      <FormField
        {...{
          label,
          isValid,
          isLight,
          labelSide,
          className,
          isNullLabel,
          isLeftLabel,
          isInline,
          isSecondary: isSecondaryLabel,
          isBase: isBaseField,
          isSmallLabel,
          tooltipPositionType,
          tooltip,
        }}
      >
        <WrappedInput {...otherProps} ref={forwardedRef} />
      </FormField>
    );
  }

  InputWithWrapper.propTypes = {
    isNullLabel: PropTypes.bool,
    isLeftLabel: PropTypes.bool,
    isSecondaryLabel: PropTypes.bool,
    isSmallLabel: PropTypes.bool,
    isBaseField: PropTypes.bool,
    tooltipPositionType: PropTypes.string,
    isInline: PropTypes.bool,
    tooltip: PropTypes.string,
    /** props added by the HOC */
    label: PropTypes.node,
    isValid: PropTypes.bool,

    /** props reused by the HOC */
    className: PropTypes.string,

    /** is not an actual prop */
    forwardedRef: CustomPropTypes.ref,
  };

  InputWithWrapper.defaultProps = {
    isSecondaryLabel: true,
  };

  /**
   * Override component name by prepending `Wrapped~`
   * to make it look nice, for example: `WrappedTextInput`
   */
  if (process.env.NODE_ENV !== 'production') {
    const WrappedComponentName =
      WrappedInput.displayName || WrappedInput.name || 'Input';
    InputWithWrapper.displayName = `Wrapped${WrappedComponentName}`;
  }

  return React.forwardRef((props, ref) => (
    <InputWithWrapper {...props} forwardedRef={ref} />
  ));
};

export default allowParamOmit(withWrapper);
