import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMenuEntries } from 'store/common/header/selectors';
import { MenuEntryItem } from 'pages/_PageLayout/components/Header/components/MenuEntries/components';
import { HamburgerRaw, MenuEntriesPopup } from './components';

function Hamburger({ menuEntries = [], className }) {
  return (
    <HamburgerRaw
      className={className}
      render={({ isOpen, onClose }) => (
        <MenuEntriesPopup isOpen={isOpen} onClose={onClose}>
          {menuEntries.map(item => (
            <MenuEntryItem url={item.url}>{item.title}</MenuEntryItem>
          ))}
        </MenuEntriesPopup>
      )}
    />
  );
}

Hamburger.propTypes = {
  menuEntries: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
};

const mapStateToProps = state => ({
  menuEntries: getMenuEntries(state),
});

export default connect(mapStateToProps)(Hamburger);
