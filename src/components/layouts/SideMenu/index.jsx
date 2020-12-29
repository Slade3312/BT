import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Heading from 'components/layouts/Heading';
import { GlobalIcon } from '../../common';
import MenuGroup from './components/MenuGroup';
import { MenuItem, MenuSubItem } from './components/MenuItem';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default class MenuList extends Component {
  hasSubItems = item => item.subItems && item.subItems.length > 0;

  render() {
    const { title, items, onItemClick, className } = this.props;
    return (
      <div className={cx(className)}>
        {title && <Heading className={styles.title}>{title}</Heading>}

        {items.map((item, index) => (
          <MenuGroup
            key={item.title}
            isLast={index === items.length - 1}
            isActive={item.isActive}
            isCompact={!this.hasSubItems(item)}
            className={item.isCustom && styles.yellowBackground}
          >
            <MenuItem
              title={item.title}
              bonusMessage={item.bonusMessage}
              href={item.href}
              isFirst={!title && index === 0}
              isLast={index === items.length - 1 && (item.subItems && !item.subItems.length)}
              onClick={!item.isDisabled ? () => onItemClick({ slugItem: item }) : null}
              isActive={item.isActive}
              isAccessible={!item.isDisabled || item.isActive}
              icon={item.icon && <GlobalIcon icon={item.icon} />}
            />

            {this.hasSubItems(item) &&
              item.subItems.map((subItem, subItemIndex) => (
                <MenuSubItem
                  key={subItem.title}
                  title={subItem.title}
                  href={subItem.href}
                  onClick={
                    subItem.isDisabled ? null : () => onItemClick({ slugItem: item, subSlugItem: subItem })
                  }
                  isLast={subItemIndex === item.subItems.length - 1}
                  isActive={subItem.isActive}
                />
              ))}
          </MenuGroup>
        ))}
        <div className={styles.contact}>
          Консультация<br/> со специалистом:
          <div className={styles.phone}>
            <GlobalIcon slug="phone" className={styles.icon} />
            <a href="tel:8 800 600 62 62" className={styles.phoneLink}>8 800 600 62 62</a>
          </div>
        </div>
      </div>
    );
  }
}

MenuList.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    isDisabled: PropTypes.bool,
    isActive: PropTypes.bool,
    subItems: PropTypes.arrayOf(PropTypes.shape({
      slug: PropTypes.string,
      title: PropTypes.string,
      isActive: PropTypes.bool,
    })),
  })),
  onItemClick: PropTypes.func,
  className: PropTypes.string,
};

MenuList.defaultProps = {
  items: [],
  onItemClick: () => {},
};
