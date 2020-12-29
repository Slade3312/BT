import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function TariffInfo({ children }) {
  return (
    <div className={cx('component')}>
      <span className={cx('text')}>{children}</span>
    </div>
  );
}

TariffInfo.propTypes = {
  children: PropTypes.node,
};

export default TariffInfo;
