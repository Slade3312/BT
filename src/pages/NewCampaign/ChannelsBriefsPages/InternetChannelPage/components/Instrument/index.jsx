import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FFCheckbox, FFSliderWithCounter } from 'components/fields';
import { RightArrowLabel } from 'components/layouts';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function Instrument({ label, min, max, info, name, isDisabled }) {
  return (
    <div className={cx('component')}>
      <div className={cx('firstRow', 'wrapper')}>
        <FFCheckbox name={`${name}.isActive`} label={label} isInactiveTransparent />
      </div>

      {!isDisabled && (
        <Fragment>
          <FFSliderWithCounter step={6000} defaultValue={min} min={min} max={max} name={`${name}.budget`} />

          <div className={cx('lastRow')}>
            <RightArrowLabel>{info}</RightArrowLabel>
          </div>
        </Fragment>
      )}
    </div>
  );
}

Instrument.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  info: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default memo(Instrument);
