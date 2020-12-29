import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { GlobalIcon, OutsideClickTracker } from 'components/common';

import { passAsIs } from 'utils/fn';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

/**
 * Must be Wrapped and extended via withToggle() before use
 */
export default class MetaSelect extends React.PureComponent {
  getLongestLabel = () =>
    this.props.options.reduce(
      (acc, next) => (acc.length >= next.label.length ? acc : next.label),
      this.props.placeholder,
    );

  handleSelect = (selectedValue) => {
    const { value, onChange, name } = this.props;
    if (selectedValue !== value) {
      onChange(selectedValue, { target: { value: selectedValue, name } });
    }
  };

  render() {
    const {
      name,
      value,
      status,
      displayValue,
      options,
      isDisabled,
      isOpen,
      onOpen,
      onClose,
      className,
      OptionsComponent,
      isCompact,
      combined,
    } = this.props;
    const classes = cx(
      'component',
      {
        opened: isOpen,
        disabled: isDisabled,
        empty: (!value || !value.length) && typeof value !== 'number',
      },
      className,
    );
    return (
      <div>
        <OutsideClickTracker onOutsideClick={isOpen ? onClose : null} className={classes}>
          <input onChange={passAsIs} value={JSON.stringify(value)} disabled={isDisabled} name={name} className={styles.input} onFocus={onOpen}/>

          <div className={cx('value', status, { combinedLeft: combined === 'left' }, { compact: isCompact })} onClick={isOpen ? onClose : onOpen}>
            <span>{displayValue}</span>

            <div className={cx('stretcher')}>{this.getLongestLabel()}</div>
          </div>

          <GlobalIcon slug="dropdownArrow" className={cx('arrow')} scale={0.75} />

          {isOpen ? (
            <OptionsComponent {...{ value, options, onClose, isCompact }} onSelect={this.handleSelect} />
          ) : null}
        </OutsideClickTracker>
      </div>
    );
  }
}

MetaSelect.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  status: PropTypes.string, // TODO: status is a bad way of handling error, should be something like isInvalid
  displayValue: PropTypes.node,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string,
  })),
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  combined: PropTypes.any,
  isCompact: PropTypes.bool,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  className: PropTypes.string,
  OptionsComponent: PropTypes.func,
};
