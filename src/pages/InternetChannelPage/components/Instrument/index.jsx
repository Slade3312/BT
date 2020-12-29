import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { FFCheckbox, FFSliderWithCounter } from 'components/fields';
import { RightArrowLabel } from 'components/layouts';

import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function Instrument(props) {
  const { NewCampaign } = useContext(StoresContext);
  const { label, min, max, info, name, isDisabled } = props;
  return (
    <div className={cx('component')}>
      <div className={cx('firstRow', 'wrapper')}>
        <FFCheckbox name={`${name}.isActive`} label={label} isInactiveTransparent />
      </div>

      {!isDisabled && (
        <Fragment>
          <FFSliderWithCounter step={5000} defaultValue={min} min={min} max={max} name={`${name}.budget`} />

          <div className={cx('lastRow')}>
            <RightArrowLabel>{NewCampaign.calculating ? <Skeleton width={150}/> : info}</RightArrowLabel>
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

export default observer(Instrument);
