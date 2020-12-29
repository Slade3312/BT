import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import GlobalIcon from 'components/common/GlobalIcon';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function DeleteButton({ className, isDisabled, onClick }) {
  return (
    <button
      type="button"
      className={cx('component', className)}
      onClick={onClick}
      disabled={isDisabled}
    >
      <GlobalIcon slug="basket" />
    </button>
  );
}

DeleteButton.propTypes = {
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
};

