import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import LinkLegacy from 'components/buttons/LinkLegacy';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const TopNavigation = ({ links }) => {
  const [openedCategories, toggleCategory] = useState({});

  return (
    links.map((category, index) => (
      <div
        key={`${category.title}_${String(Math.random)}`}
        className={cx('category', category.mobileOnly && 'mobileOnly', !openedCategories[index] && 'collapsed')}
      >
        <div
          className={cx('categoryTitle')}
          onClick={() => {
            toggleCategory({
              ...openedCategories,
              [index]: !openedCategories[index],
            });
          }}
        >
          {category.title}
        </div>

        <div className={cx('categoryLinks')}>
          {category.links.map(link => (
            <LinkLegacy
              href={link.value}
              className={['light']}
              key={link.value}
            >
              {link.name}
            </LinkLegacy>
          ))}
        </div>
      </div>
    ))
  );
};

TopNavigation.propTypes = {
  links: PropTypes.array,
};

export default TopNavigation;
