import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Option } from 'components/fields/MultiTabSelect/components/Option';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

/**
 * Create component with multiple phones labels.
 *
 * @param {Object} phonesList - object from 'react-final-form-arrays'.
 * @param {Function} phonesList.map - iterates by elements of inner array (name, index) => {}
 * @param {Function} phonesList.remove - remove element by id in inner array
 */
const MultiplePhoneTabs = ({ phonesList }) => (phonesList.value ? (
  <div
    className={cx('wrapper')}
  >
    {phonesList.map((name, index) => (
      <div className={cx('tab')} key={phonesList.value[index].value}>
        <Option
          textClassName={cx('labelText')}
          key={phonesList.value[index].value}
          label={phonesList.value[index].value}
          value={phonesList.value[index].value}
          isActive
          onRemove={() => phonesList.remove(index)}
        />
      </div>
    ))}
  </div>
) : null);

MultiplePhoneTabs.propTypes = {
  phonesList: PropTypes.shape({
    map: PropTypes.func,
    remove: PropTypes.func,
    value: PropTypes.array,
  }),
};

export default MultiplePhoneTabs;
