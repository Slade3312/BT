import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import CustomPropTypes from 'utils/prop-types';

import CrossIcon from '../components/assets/cross.svg';
import { fakeChangeEvent } from './helpers';
import styles from './parts/withIcon/styles.pcss';

const cx = classNames.bind(styles);


export function InputIcon({ Icon, title, onClick }) {
  return (
    <button className={cx('icon', { iconActive: !!onClick })} type="button" title={title} onClick={onClick}>
      <Icon />
    </button>
  );
}

InputIcon.propTypes = {
  Icon: PropTypes.func,
  title: PropTypes.string,
  onClick: PropTypes.func,
};


export default function withIcon(WrappedInput) {
  class InputWithIcon extends Component {
    onClear = event => this.props.onChange('', fakeChangeEvent(event, ''));

    hasIcon = () => {
      const { Icon, isClearable } = this.props;

      // indent clearable inputs even when icon is hidden to prevent padding jumping
      return isClearable || Icon;
    };

    renderIcon = () => {
      const { isClearable, value, Icon, iconAlt, onIconClick } = this.props;
      if (isClearable && value) {
        return <InputIcon title="Очистить" onClick={this.onClear} Icon={CrossIcon} />;
      } else if (Icon) {
        return <InputIcon title={iconAlt} onClick={onIconClick} Icon={Icon} />;
      }
      return null;
    };

    render() {
      const {
        forwardedRef,
        isClearable,
        Icon,
        iconAlt,
        onIconClick,
        onClear,
        className,
        ...otherProps
      } = this.props;
      return (
        <div className={cx('container', className)}>
          <WrappedInput
            {...otherProps}
            ref={forwardedRef}
            className={cx({ inputWithIcon: this.hasIcon() })}
          />
          {this.renderIcon()}
        </div>
      );
    }
  }

  InputWithIcon.propTypes = {
    /** props added by the HOC */
    Icon: PropTypes.func,
    iconAlt: PropTypes.string,
    isClearable: PropTypes.bool,
    onIconClick: PropTypes.func,
    onClear: PropTypes.func,

    /** props reused by the HOC */
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,

    /** is not an actual prop */
    forwardedRef: CustomPropTypes.ref,
  };


  /**
   * Override component name by prepending `Contained~`
   * to make it look nice, for example: `ContainedTextInput`
   */
  if (process.env.NODE_ENV !== 'production') {
    const WrappedComponentName = WrappedInput.displayName || WrappedInput.name || 'Input';
    InputWithIcon.displayName = WrappedComponentName;
  }

  return React.forwardRef((props, ref) => (
    <InputWithIcon {...props} forwardedRef={ref} />
  ));
}
