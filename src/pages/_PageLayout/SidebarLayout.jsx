import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FollowContainer } from 'components/helpers';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function SidebarLayout({ children, className }) {
  return (
    <div className={className}>
      <FollowContainer preventFixLeft watchResize offsetTop={6}>
        <div className={cx('navIn')}>
          {children}
        </div>
      </FollowContainer>
    </div>
  );
}

SidebarLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
