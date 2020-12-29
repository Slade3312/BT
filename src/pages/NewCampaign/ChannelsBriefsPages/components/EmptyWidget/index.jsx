import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function EmptyWidget({ name, className }) {
  return (
    <div className={cx('component', className)}>
      <div className={cx('wrapper')}>
        <div className={cx('infoContainer')}>
          <div className={cx('text')}>
            {name}
            <GlobalIcon slug="arrowRightMinimal" className={cx('icon')} />
          </div>
          <div className={cx('text')}>Скоро старт</div>
        </div>
      </div>
    </div>
  );
}

EmptyWidget.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
};
