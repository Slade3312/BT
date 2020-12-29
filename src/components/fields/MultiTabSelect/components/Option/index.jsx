import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';
import { stopPropagation } from 'utils/events';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const optionTypes = {
  small: Symbol('option-types-small'),
};

export const Option = ({
  value,
  label,
  isActive,
  onSelect,
  onRemove,
  isClickable,
  isWithoutRemove,
  optionType,
  textClassName,
  isInBlackList,
}) => {
  const handleRemoveItem = (e) => {
    stopPropagation(e);
    onRemove(value);
  };

  return (
    <div className={cx('wrapper', { small: optionType === optionTypes.small })}>
      <div
        className={cx('content', { active: isActive, isInBlackList, clickable: isClickable })}
        onClick={() => {
          if (!isActive) {
            onSelect(value);
          }
        }}
      >
        <span className={cx('label', textClassName)}>
          {label}
        </span>

        {isActive && !isWithoutRemove &&
          <span onClick={handleRemoveItem} className={cx('crossContainer')}>
            <div className={cx('cross')}>
              <GlobalIcon slug="cross" className={cx('crossIcon')} />
            </div>
          </span>
        }
      </div>
    </div>
  );
};

Option.propConstants = {
  types: optionTypes,
};

Option.propTypes = {
  value: PropTypes.any,
  label: PropTypes.string,
  optionType: PropTypes.symbol,
  isActive: PropTypes.bool,
  isInBlackList: PropTypes.bool,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  isClickable: PropTypes.bool,
  isWithoutRemove: PropTypes.bool,
  textClassName: PropTypes.string,
};

Option.defaultProps = {
  onSelect: () => {},
  onRemove: () => {},
};
