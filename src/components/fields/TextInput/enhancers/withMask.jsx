/**
 * NOTE: when using along with `withIcon`, `withIcon` must be used above `withMask`,
 * or isClearable must be defined in resulting component,
 * otherwise issues with empty input with clear button will appear
 */
import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import { isNullOrUndefined } from 'utils/fn';
import {
  getCursorPosition,
  setCursorPosition,
  getCursorSelectionLength,
  getPositionOfOccurrence,
} from './helpers';

const KEYBOARD_BACKSPACE_KEYCODE = 8;

/**
 * Simple MaskedInput handles mask properly
 * while passing all the props freely as if element is an input
 */
export default function withMask(WrappedInput) {
  class MaskedInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isFocused: false,
      };

      /**
       * current and prev mask are used to properly manage unmasking,
       * it doesn't literally affect component, thus is not in state
       */
      this.currentMaskedValue = this.maskValue(props.value);
      this.prevMaskedValue = '';

      /**
       * next cursor buffers position to be fired on componentDidUpdate
       */
      this.nextMaskIndex = -1;
    }

    componentDidUpdate(prevProps, prevState) {
      this.prevMaskedValue = this.currentMaskedValue;

      if (this.nextMaskIndex !== -1) {
        this.setCursorOnPlaceholder(this.nextMaskIndex);
        this.nextMaskIndex = -1;
      } else if (prevState.isFocused === false && this.state.isFocused && !this.shouldShowPlaceholder()) {
        /** when we focus empty field, initial mask content appears and we need to move cursor after it */
        requestAnimationFrame(() => this.setCursorPosition((this.getInputElement().value || '').length));
      }
    }

    getInputElement = () => this.props.forwardedRef.current;

    setCursorPosition = caretPos => setCursorPosition(this.getInputElement(), caretPos);
    getCursorPosition = () => getCursorPosition(this.getInputElement());
    getCursorSelectionLength = () => getCursorSelectionLength(this.getInputElement());

    /**
     * set cursor on masks `revIndex`th placeholder from the end
     * if before is true, cursor will be set before given placeholder
     */
    setCursorOnPlaceholder = (number) => {
      const { mask, value } = this.props;
      /** apply this hack if i want to move cursor to end when typing */
      if (number === 0) {
        /** if at first character, just set cursor at the first writable character */
        this.setCursorPosition(mask.indexOf('_'));
      } else if (number === value.length) {
        /** if at the end, set it to the end */
        this.setCursorPosition(this.getInputElement().value.length);
      } else {
        /** otherwise set it up to the place */
        const caretPos = getPositionOfOccurrence(mask, '_', number - 1);
        this.setCursorPosition(caretPos + 1);
      }
    };

    /**
     * We show placeholder if it is not null, value is empty and input is not focused
     */
    shouldShowPlaceholder() {
      const { value, placeholder } = this.props;
      const { isFocused } = this.state;
      return isNullOrUndefined(value) && !isFocused && typeof placeholder === 'string';
    }

    maskValue = (value) => {
      const { mask } = this.props;
      let maskedValue = '';
      let valueIndex = 0;
      let caretPos;
      for (caretPos = 0; caretPos < mask.length; caretPos += 1) {
        if (mask[caretPos] === '_') {
          if (valueIndex >= value.length) break;
          maskedValue += value[valueIndex];
          valueIndex += 1;
        } else {
          maskedValue += mask[caretPos];
        }
      }
      return maskedValue;
    };

    handleChange = (_, event) => {
      const { onChange, unmaskValue } = this.props;
      const maskedValue = event.target.value;
      const value = unmaskValue(maskedValue, this.prevMaskedValue);

      this.currentMaskedValue = maskedValue;

      /**
       * we determine maskIndex position for next tick by counting number of characters after unmask
       */
      this.nextMaskIndex = unmaskValue(maskedValue.slice(0, this.getCursorPosition()), this.prevMaskedValue).length;

      if (onChange) onChange(value, event);
    };

    handleKeyDown = (event) => {
      const { onKeyDown, mask } = this.props;

      if (event.keyCode === KEYBOARD_BACKSPACE_KEYCODE) {
        /**
         * Only apply out hack if selection is empty or currently erased element is not '_'
         */
        const domNode = this.getInputElement();
        const cursor = this.getCursorPosition() - 1;

        if (!this.getCursorSelectionLength() && mask[cursor] !== '_') {
          const prevCursorPos = mask.lastIndexOf('_', cursor);

          if (cursor === -1 || prevCursorPos === -1) {
            event.preventDefault();
          } else if (prevCursorPos !== -1) {
            domNode.value = domNode.value.slice(0, prevCursorPos) + domNode.value.slice(prevCursorPos + 1);
            this.setCursorPosition(cursor);
          }
        }
      }
      if (onKeyDown) onKeyDown(event);
    };

    /**
     * we have to override onFocus and onBlur,
     * normally they fire with event as first argument,
     * we add value as second
     */
    handleFocus = (_, event) => {
      const { onFocus, value } = this.props;
      if (onFocus) onFocus(value, event);
      this.setState({ isFocused: true });
    };

    handleBlur = (_, event) => {
      const { onBlur, value } = this.props;
      if (onBlur) onBlur(value, event);
      this.setState({ isFocused: false });
    };

    render() {
      const { value, forwardedRef, mask, unmaskValue, isClearable, ...otherProps } = this.props;
      return (
        <WrappedInput
          {...otherProps}
          value={this.shouldShowPlaceholder() ? '' : this.maskValue(value)}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          ref={forwardedRef}
          /** if isClearable is true, we show clear button only when value is not empty */
          {...typeof isClearable !== 'undefined' ? { isClearable: isClearable && !!value } : {}}
        />
      );
    }
  }

  MaskedInput.propTypes = {
    value: PropTypes.string,

    /** string with '_' placeholders */
    mask: PropTypes.string.isRequired,
    /**
     * fn to clean mask constants out of value
     * takes two arguments - (maskedValue, prevMaskedValue)
     * returns value or an array [value, cursor]
     */
    unmaskValue: PropTypes.func.isRequired,

    /** default props of input dom element */
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,

    /** is not an actual prop */
    forwardedRef: CustomPropTypes.ref,

    /** CrossProps, these props will be here if we wrap withIcon around our MaskedInput */
    isClearable: PropTypes.bool,
  };

  MaskedInput.defaultProps = {
    /**
     * if placeholder is null, we show part of mask instead,
     * if its a string, even empty, we show placeholder
     */
    placeholder: '',
  };


  /**
   * Override component name by prepending `Masked~`
   * to make it look nice, for example: `MaskedTextInput`
   */
  if (process.env.NODE_ENV !== 'production') {
    const WrappedComponentName = WrappedInput.displayName || WrappedInput.name || 'Input';
    MaskedInput.displayName = `Masked${WrappedComponentName}`;
  }

  return React.forwardRef((props, ref) => (
    <MaskedInput {...props} forwardedRef={ref || React.createRef()} />
  ));
}
