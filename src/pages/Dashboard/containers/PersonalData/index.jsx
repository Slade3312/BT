import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { MainBanner, UserInfoCardHovered } from 'pages/Dashboard/components';

import sharedStyles from '../../shared.pcss';
import styles from './styles.pcss';

const cx = classNames.bind({ ...sharedStyles, ...styles });

function PersonalData({ className }) {
  return (
    <div className={cx('container', 'marg-cards', className)}>
      <MainBanner />

      <div className={cx('userInfoContainer')}>
        <UserInfoCardHovered />
      </div>
    </div>
  );
}

PersonalData.propTypes = {
  className: PropTypes.string,
};

export default PersonalData;
