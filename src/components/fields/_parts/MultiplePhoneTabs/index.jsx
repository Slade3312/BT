import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Option } from 'components/fields/MultiTabSelect/components/Option';
import { formatPhone, formatPhoneRu, formatTenNumbersPhone } from 'utils/formatting';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

/**
 * Create component with multiple phones labels.
 *
 * @param {Object} phonesList - object from 'react-final-form-arrays'.
 * @param {Function} phonesList.map - iterates by elements of inner array (name, index) => {}
 * @param {Function} phonesList.remove - remove element by id in inner array
 */
const MultiplePhoneTabs = ({ phonesList }) => {
  const checkFormat = (number) => {
    if (number[0] === '9') return formatPhoneRu(number);
    if (number[0] === '+') return `+${formatPhone(number)}`;
    else if (number <= 5) return number;
    else if (number.length === 10) return formatTenNumbersPhone(number);
    return formatPhone(number);
  };


  return (phonesList.value && phonesList?.value?.length ? (
    <div className={cx('wrapper')}>
      {phonesList.value.map((name, index) => {
        const value = phonesList.value[index];
        return (
          <div className={cx('tab')} key={`${value}-${Math.random().toString()}`}>
            <Option
              textClassName={cx('labelText')}
              label={checkFormat(`${value}`)}
              value={value}
              isActive
              onRemove={() => phonesList.remove(index)}
            />
          </div>
        );
      })}
    </div>
  ) : null);
};

MultiplePhoneTabs.propTypes = {
  phonesList: PropTypes.shape({
    map: PropTypes.func,
    remove: PropTypes.func,
    value: PropTypes.array,
  }),
};

export default MultiplePhoneTabs;
