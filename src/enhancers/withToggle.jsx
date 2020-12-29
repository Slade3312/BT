import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import { assertBooleanOrNull } from 'utils/assert';
import { allowParamOmit } from 'utils/decorators';


const withToggle = ([isOpenProp = 'isOpen', onOpenProp = 'onOpen', onCloseProp = 'onClose'] = []) =>
  (WrappedComponent) => {
    class Toggleable extends React.Component {
      constructor(props) {
        super(props);

        assertBooleanOrNull(props[isOpenProp], 'constructor', `props.${isOpenProp}`);
        this.state = {
          [isOpenProp]: !!props[isOpenProp],
        };
      }

      handleOpen = () => {
        const { [onOpenProp]: onOpen } = this.props;
        this.setState({ [isOpenProp]: true });
        if (onOpen) onOpen();
      };

      handleClose = () => {
        const { [onCloseProp]: onClose } = this.props;
        this.setState({ [isOpenProp]: false });
        if (onClose) onClose();
      };

      render() {
        const { [isOpenProp]: isOpen } = this.state;
        const { forwardedRef, ...otherProps } = this.props;
        return (
          <WrappedComponent
            {...otherProps}
            ref={forwardedRef}
            {...{ [onOpenProp]: this.handleOpen }}
            {...{ [onCloseProp]: this.handleClose }}
            {...{ [isOpenProp]: isOpen }}
          />
        );
      }
    }


    Toggleable.propTypes = {
      ...WrappedComponent.propTypes,
      /**
       * onToggle is used to maintain [isOpenProp] state
       * while `[isOpenProp]` acts like initial [isOpenProp]
       */
      [isOpenProp]: PropTypes.bool,
      [onOpenProp]: PropTypes.func,
      [onCloseProp]: PropTypes.func,

      /** is not an actual prop */
      forwardedRef: CustomPropTypes.ref,
    };


    /**
     * Override component name by prepending `Toggleable~`
     * to make it look nice, for example: `ToggleableComponent`
     */
    if (process.env.NODE_ENV !== 'production') {
      const WrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || '';
      Toggleable.displayName = `Toggleable${WrappedComponentName}`;
    }

    return React.forwardRef((props, ref) => (
      <Toggleable {...props} forwardedRef={ref} />
    ));
  };

export default allowParamOmit(withToggle);
