import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';

import { pushSocialLinkClickToGA } from 'utils/ga-analytics/utils';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const BottomNavigation = ({ links }) => (
  <div className={cx('component')}>
    <div className={cx('links')}>
      <div className={cx('socialLinks')}>
        {links.map(link => (
          <a
            className={cx('link', link.name)}
            onClick={() => { pushSocialLinkClickToGA({ name: link.name }); }}
            href={link.url}
            rel="noopener noreferrer"
            target="_blank"
            key={link.url}
          >
            <GlobalIcon
              className={cx('icon')}
              icon={link.icon}
              slug={link.name}
            />
          </a>
        ))}
      </div>
    </div>
  </div>
);

BottomNavigation.propTypes = {
  links: PropTypes.array,
};

export default BottomNavigation;
