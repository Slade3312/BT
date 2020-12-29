import React from 'react';
import classNames from 'classnames/bind';
import { MainLogoPng } from './assets';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ReportHeader() {
  return <img src={MainLogoPng} className={cx('component')} alt="ПРОдвижение" />;
}
