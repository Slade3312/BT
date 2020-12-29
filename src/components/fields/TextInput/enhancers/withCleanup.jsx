import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';


const equalsTrimmed = (nextValue, prevValue) => nextValue.trim() === prevValue.trim();


/**
 * Adds hidden trimming to input, input returns trimmed value, but shows the original one
 *
 * If a new `value` passed to input externally will not match the one passed by `onChange`
 * a trimmed value will be visualized instead
 *
 * Behavior can be completely turned off by passing autoTrim={false}
 */
// TODO: refactor and simplify it, check working on all market eco fields
// it temporary removed because async setState removes react events from global pull
export default function withCleanup(WrappedInput) {
  class CleanInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: this.shouldTrimInitialValue() ? (props.value || '').trim() : props.value,
      };
    }

    static getDerivedStateFromProps = ({ value, autoTrim }, { nextValue, value: localValue }) => {
      /** if autoTrim is disabled, we turn gdsfp into a pure proxy */
      if (!autoTrim) return { value };
      /** if we set value via setState */
      if (typeof nextValue !== 'undefined') {
        return { value: nextValue, nextValue: undefined };
      /** if incoming value is clean callback caused by onChange */
      } else if (equalsTrimmed(localValue, value)) {
        return null;
      }
      /** otherwise just trim input */
      return { value: value.trim() };
    };

    /**
     * Initial value trimming inherits from autoTrim
     * unless the trimInitialValue is set to a boolean value
     */
    shouldTrimInitialValue = () => {
      const { autoTrim, trimInitialValue } = this.props;
      return typeof trimInitialValue === 'boolean' ? trimInitialValue : autoTrim;
    };

    handleChange = (nextValue, event) => {
      const { onChange, onRawChange, autoTrim } = this.props;
      const { value } = this.state;

      /** onRawChange is always called with the real input value */
      if (onRawChange) onRawChange(nextValue, event);

      /** if onChange is not present there is no need for any custom trimming */
      if (!onChange) return;

      /** if `autoTrim` is disabled we call `onChange` straight away */
      if (!autoTrim) onChange(nextValue, event);

      /** otherwise we change state locally and only fire onChange when needed */
      const persistEventData = { target: event.target }; // don't use a whole event.persist() for a bit of optimization
      this.setState({ nextValue }, () => { // eslint-disable-line react/no-unused-state
        if (!equalsTrimmed(nextValue, value)) onChange(nextValue.trim(), persistEventData);
      });
    };

    render() {
      const { value } = this.state;
      const { forwardedRef, autoTrim, trimInitialValue, onRawChange, ...otherProps } = this.props;
      return (
        <WrappedInput
          {...otherProps}
          ref={forwardedRef}
          onChange={this.handleChange}
          value={value}
        />
      );
    }
  }

  CleanInput.propTypes = {
    /** onChange only fires when value actually changes (doesn't fire if only spaces are added at sides) */
    onChange: PropTypes.func,
    /** whilst onRawChange fires every time any change occurred */
    onRawChange: PropTypes.func,
    value: PropTypes.any,

    /** autoTrim keeps input value the way user entered it, but only fires onChange when value is trimmed */
    autoTrim: PropTypes.bool,
    trimInitialValue: PropTypes.bool,

    /** is not an actual prop */
    forwardedRef: CustomPropTypes.ref,
  };

  CleanInput.defaultProps = {
    autoTrim: true,
    /** trimInitial is enabled if autoTrim is enabled, but it can be turned off */
    // trimInitialValue: autoTrim,
  };

  /**
   * Override component name by prepending `Clean~`
   * to make it look nice, for example: `CleanTextInput`
   */
  if (process.env.NODE_ENV !== 'production') {
    const WrappedComponentName = WrappedInput.displayName || WrappedInput.name || 'Input';
    CleanInput.displayName = `Clean${WrappedComponentName}`;
  }

  return React.forwardRef((props, ref) => (
    <CleanInput {...props} forwardedRef={ref} />
  ));
}
