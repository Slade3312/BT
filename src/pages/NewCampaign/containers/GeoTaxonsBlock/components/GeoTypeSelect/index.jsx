import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FFSelect } from 'components/fields';
import { FormField } from 'components/forms';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function GeoTypeSelect({ geoStatusOptions, geoHeaders }) {
  return (
    <FormField
      label={geoHeaders.title}
      tooltip={geoHeaders.tooltip}
      className={cx('wrapper')}
    >
      <FFSelect
        options={geoStatusOptions}
        name="geo_type"
      />
    </FormField>
  );
}

GeoTypeSelect.propTypes = {
  geoStatusOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  geoHeaders: PropTypes.shape({
    title: PropTypes.string,
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }),
};

export default GeoTypeSelect;
