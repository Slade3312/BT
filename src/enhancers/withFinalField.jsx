import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { passAsIs } from '../utils/fn';


export default function withFinalField(WrappedInput) {
  class FFInput extends React.PureComponent {
    render() {
      const {
        input: { name, value, onChange: onChangeFF, onFocus, onBlur: onBlurFF },
        meta: { touched, error },
        error: forcedError,
        valueProxy,
        onChangeProxy,
        errorProxy,
        ...inheritedProps
      } = this.props;

      const handleBlur = (val, event) => {
        const nextValue = onChangeProxy ? onChangeProxy(val) : val;
        if (this.props.onBlur) {
          this.props.onBlur(event);
        }
        onBlurFF(nextValue);
      };

      const handleChange = (val, event) => {
        const nextValue = onChangeProxy ? onChangeProxy(val) : val;

        if (this.props.onChange) {
          this.props.onChange(event);
        }
        onChangeFF(nextValue);
      };

      const val = typeof valueProxy === 'function' ? valueProxy(value) : value;
      const err = typeof errorProxy === 'function' ? errorProxy(error) : error;

      /**
       * Error should not be shown initially on an empty field
       */

      return (
        <WrappedInput
          {...inheritedProps}
          onFocus={onFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...(typeof val !== 'undefined' && val !== null) ? { value: val } : {}}
          name={name}
          /** There are three sources of errors - manually passed error, validation error and submission error */
          error={touched && err ? err : null}
          status={touched && err ? 'fail' : null}
        />
      );
    }
  }

  FFInput.propTypes = {
    valueProxy: PropTypes.func, /** to override value before passing it to underlying component */
    onChangeProxy: PropTypes.func, /** to override value before passing it back to redux forms */
    errorProxy: PropTypes.func,

    /** usual native handlers  */
    onChange: PropTypes.func,
    onBlur: PropTypes.func,

    /** final-form props */
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
    }),
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      initial: PropTypes.any,
      error: PropTypes.string,
      submitError: PropTypes.string,
      dirtySinceLastSubmit: PropTypes.bool,
    }),

    // inheritedProps
    type: PropTypes.string,
    error: PropTypes.string,
  };

  /**
   * Override component name by prepending `FF~`
   * to make it look nice, for example: `FFTextInput`
   */
  if (process.env.NODE_ENV !== 'production') {
    const WrappedComponentName = WrappedInput.displayName || WrappedInput.name || 'Input';
    FFInput.displayName = `FF${WrappedComponentName}`;
  }

  const FFInputField = props => (
    <Field
      component={FFInput}
      parse={passAsIs}
      format={passAsIs}
      allowNull
      {...props}
    />
  );

  /**
   * FFInputField has same props as Wrapped component
   */
  FFInputField.propTypes = {
    name: PropTypes.string.isRequired,
    /** inherited props */
  };

  /** furthermore, wrap all FF fields with NestedFFContext, to support nesting */
  // return withFinalFormContext(FFInputField);
  return FFInputField;
}
