import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { MultiTabSelect } from 'components/fields';
import CustomPropTypes from 'utils/prop-types';
import { PureButton } from 'components/buttons';

import styles from './styles.pcss';

const Tabs = ({ items, onRemoveValue, isWithoutRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div className={classNames(styles.container, isOpen && styles.visible)}>
      <MultiTabSelect
        type="active"
        options={items}
        onRemoveValue={onRemoveValue}
        isWithoutRemove={isWithoutRemove}
      />
      <div className={styles.linkWrapper}>
        <PureButton onClick={handleClick} className={styles.showMore}>
          Показать все параметры
        </PureButton>
      </div>
    </div>
  );
};

Tabs.propTypes = {
  items: CustomPropTypes.options,
  onRemoveValue: PropTypes.func,
  isWithoutRemove: PropTypes.bool,
};

export default Tabs;
