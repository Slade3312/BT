import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { MultiTabSelect } from 'components/fields';
import { Option } from 'components/fields/MultiTabSelect/components/Option';
import { withToggle } from 'enhancers';

import CustomPropTypes from 'utils/prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Tabs = ({ items, onRemoveValue, isMobile, isOpen }) => (
  <div className={cx('container', { expanded: isOpen })}>
    <div className={cx('wrapper', { expanded: isOpen })}>
      <MultiTabSelect
        type="active"
        options={items}
        optionsType={Option.propConstants.types.small}
        onRemoveValue={onRemoveValue}
        isMobile={isMobile}
        isClickableOptions
      />
      {!isOpen && <div className={cx('linkWrapper')} />}
    </div>
  </div>
);

Tabs.propTypes = {
  items: CustomPropTypes.options,
  onRemoveValue: PropTypes.func,
  isMobile: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export default withToggle(Tabs);
