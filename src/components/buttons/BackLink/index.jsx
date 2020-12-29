import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import GlobalIcon from '../../common/GlobalIcon';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function BackLink({ onClick, children, className }) {
  return (
    <div className={cx('content', className)} onClick={onClick}>
      <GlobalIcon slug="arrowLeftBack" className={cx('arrow')} />

      <span className={cx('text')}>{children}</span>
    </div>
  );
}

BackLink.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

BackLink.defaultProps = {
  children: 'Назад',
};
