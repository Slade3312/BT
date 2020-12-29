import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import withForwardedRef from 'enhancers/withForwardedRef';


export default function withState(WrappedInput) {
  class StatefulInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        /** if value is missing, empty string is used by default */
        value: 'value' in props ? props.value : '',
      };
    }

    handleChange = (value, event) => {
      const { onChange } = this.props;

      this.setState({ value });
      if (onChange) onChange(value, event);
    };

    render() {
      const { value } = this.state;
      const { forwardedRef, ...otherProps } = this.props;
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

  StatefulInput.propTypes = {
    /**
     * onChange is used to maintain value state
     * while `value` acts like initial value
     */
    value: PropTypes.any,
    onChange: PropTypes.func,

    /** is not an actual prop */
    forwardedRef: CustomPropTypes.ref,
  };


  /**
   * Override component name by prepending `Stateful~`
   * to make it look nice, for example: `StatefulTextInput`
   */
  if (process.env.NODE_ENV !== 'production') {
    const WrappedComponentName = WrappedInput.displayName || WrappedInput.name || 'Input';
    StatefulInput.displayName = `Stateful${WrappedComponentName}`;
  }

  return withForwardedRef(StatefulInput);
}
