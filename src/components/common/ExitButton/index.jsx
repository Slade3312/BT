import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import GlobalIcon from 'components/common/GlobalIcon';
import PureButton from 'components/buttons/PureButton';
import styles from './styles.pcss';

export default function ExitButton({ onClick, className }) {
  return (
    <PureButton
      className={classNames(styles.component, className)}
      onClick={onClick}>
      <GlobalIcon className={styles.button} slug="cross" />
    </PureButton>
  );
}

ExitButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};
