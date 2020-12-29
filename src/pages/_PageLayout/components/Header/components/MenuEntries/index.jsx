import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMenuEntries } from 'store/common/header/selectors';

import { MenuEntryList, MenuEntryItem } from './components';

function MenuEntries({ menuEntries = [], className }) {
  return (
    <MenuEntryList className={className}>
      {menuEntries.map(item => (
        <MenuEntryItem url={item.href} key={item.href}>{item.title}</MenuEntryItem>
      ))}
    </MenuEntryList>
  );
}

MenuEntries.propTypes = {
  menuEntries: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
};

const mapStateToProps = state => ({
  menuEntries: getMenuEntries(state),
});

export default connect(mapStateToProps)(MenuEntries);
