import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function Option({ children, onRemove }) {
  return (
    <div className={cx('component')}>
      <span className={cx('label')}>{children}</span>
      <span onClick={onRemove} className={cx('crossContainer')}>
        <div className={cx('cross')}>
          <GlobalIcon slug="cross" className={cx('crossIcon')} />
        </div>
      </span>
    </div>
  );
}

Option.propTypes = {
  children: PropTypes.string,
  onRemove: PropTypes.func,
};
