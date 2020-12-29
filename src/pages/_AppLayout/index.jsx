import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useLocation } from '@reach/router';
import { TINDER_URL } from 'pages/constants';

import Header from '../_PageLayout/components/Header';
import FooterContainer from '../_PageLayout/containers/FooterContainer';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function AppLayout({ children }) {
  const location = useLocation();
  return (
    <div className={cx('component')}>
      <Header />

      <main className={cx('content')}>{children}</main>

      {
        location.pathname !== TINDER_URL &&
        <FooterContainer />
      }

    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node,
};
