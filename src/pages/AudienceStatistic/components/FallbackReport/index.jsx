import React from 'react';
import classNames from 'classnames/bind';
import { Preloader } from 'components/common';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function FallbackReport() {
  return (
    <div className={cx('component')}>
      <Preloader className={cx('preloader')} />
      <div className={cx('infoText')}>Загрузка отчёта</div>
    </div>
  );
}
