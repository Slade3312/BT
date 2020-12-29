import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import TopNavigation from './TopNavigation';
import BottomNavigation from './BottomNavigation';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Footer = ({ description, linksGroups, socials }) => (
  <div className={cx('wrapper')}>
    <footer className={cx('component')}>
      <section className={cx('section', 'topNav')}>
        <TopNavigation links={linksGroups} />
      </section>

      <section className={cx('section', 'bottomNav')}>
        <BottomNavigation links={socials} />

        <div className={cx('copyright', 'bottom', 'desktop')}>
          {description}
        </div>
      </section>
    </footer>
  </div>
);


Footer.propTypes = {
  description: PropTypes.node,
  linksGroups: PropTypes.array,
  socials: PropTypes.array,
};

export default Footer;
