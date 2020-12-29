import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import GlobalIcon from '../../common/GlobalIcon';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function RightArrowLabel({ children, className }) {
  return (
    <div className={cx('component', className)}>
      <GlobalIcon className={cx('arrowAfter')} slug="arrowRightBold" />
      <span className={cx('labelRight')}>{children}</span>
    </div>
  );
}

RightArrowLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
