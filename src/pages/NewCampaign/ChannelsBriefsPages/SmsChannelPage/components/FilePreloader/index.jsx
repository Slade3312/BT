import React from 'react';
import classNames from 'classnames/bind';

import Icon from '../Icon';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function FilePreloader() {
  return (
    <div
      key="loader"
      className={cx('fileContainer', 'transparent')}
    >
      <Icon slug="fileExisting" className={cx('fileIcon')} />

      <span className={cx('fileName')}>
        Загрузка файла
      </span>

      <Icon slug="loader" className={cx('loaderIcon')} />
    </div>
  );
}
