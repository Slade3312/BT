import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Switch } from 'components/fields';
import { ORDER_ACTIVE_FIELD } from 'store/NewCampaign/channels/constants';
import { stopPropagation } from 'utils/events';
import styles from './styles.pcss';

const cx = classNames.bind(styles);


const ToggleSwitch = ({ onChange, isLoading, value, isDisabled }) => (
  <div className={cx('container')} onMouseDown={stopPropagation}>
    <Switch
      isDisabled={isDisabled}
      value={value}
      isLoading={isLoading}
      name={ORDER_ACTIVE_FIELD}
      keepErrorIndent={false}
      onChange={onChange}
    />
  </div>
);

ToggleSwitch.propTypes = {
  onChange: PropTypes.func,
  isLoading: PropTypes.bool,
  value: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default ToggleSwitch;
