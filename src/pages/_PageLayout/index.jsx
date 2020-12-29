import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import SidebarRouter from 'containers/SidebarRouter';
import { PAGE_CONTENT_DOM_NODE_ID } from './constants';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function PageLayout({ isLeftMenuHide, children }) {
  return (
    <Fragment>
      <div className={cx('content')} id={PAGE_CONTENT_DOM_NODE_ID}>
        <div className={cx('contentWrap')}>
          {!isLeftMenuHide && <SidebarRouter className={cx('nav')} />}

          <div className={cx('contentIn')}>{children}</div>
        </div>
      </div>
    </Fragment>
  );
}

PageLayout.propTypes = {
  isLeftMenuHide: PropTypes.bool,
  children: PropTypes.node,
};
