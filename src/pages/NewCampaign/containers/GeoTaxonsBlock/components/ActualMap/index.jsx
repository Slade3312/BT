import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ActionButton } from 'components/buttons/ActionButtons';
import PlaceMark from '../../assets/point.cur';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function ActualMap({ randomId, isCheckModeActive, setIsCheckModeActive }) {
  const [isIE, setIsIE] = useState(false);

  const checkIE = () => {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
      setIsIE(true);
    } else {
      setIsIE(false);
    }
  };

  useEffect(() => {
    checkIE();
  }, []);

  return (
    <div
      id={randomId}
      className={cx('map')}
      style={{
        // eslint-disable-next-line no-nested-ternary
        cursor: isCheckModeActive ? (
          isIE ? `url(${PlaceMark}), pointer` : `url(${PlaceMark}) 13 21, auto`
        ) : 'auto',
      }}
    >
      <ActionButton
        className={cx('checkButton')}
        style={{
          // eslint-disable-next-line no-nested-ternary
          cursor: isCheckModeActive ? (
            isIE ? `url(${PlaceMark}), pointer` : `url(${PlaceMark}) 13 21, auto`
          ) : 'auto',
        }}
        onClick={() => {
          setIsCheckModeActive(prev => !prev);
        }}
        iconSlug="placeMark"
      >
        Отметить на карте
      </ActionButton>
    </div>
  );
}

ActualMap.propTypes = {
  randomId: PropTypes.string,
  isCheckModeActive: PropTypes.bool,
  setIsCheckModeActive: PropTypes.func,
};

export default ActualMap;
