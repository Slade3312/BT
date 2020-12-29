import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from '@reach/router';
import { BackLink } from 'components/buttons';
import styles from './styles.pcss';

export default function ReturnToChannelsButton({ className }) {
  const navigate = useNavigate();

  const handleReturn = () => {
    window.history.back();
  };

  return (
    <BackLink onClick={handleReturn} className={classNames(className, styles.component)}>
      Назад
    </BackLink>
  );
}

ReturnToChannelsButton.propTypes = {
  className: PropTypes.string,
};
