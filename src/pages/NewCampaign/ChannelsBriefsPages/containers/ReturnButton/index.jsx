import classNames from 'classnames';
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { navigate, useNavigate } from '@reach/router';
import { BackLink } from 'components/buttons';
import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';

function ReturnToChannelsButton({ className }) {
  const { NewCampaign } = useContext(StoresContext);
  const handleReturn = () => {
    navigate(`/new-campaign/${NewCampaign.currentCampaign.id}/audience`);
  };

  if (NewCampaign.currentCampaign.currentOrder.status_id === 7) return null;

  return (
    <BackLink onClick={handleReturn} className={classNames(className, styles.component)}>
      Назад
    </BackLink>
  );
}

ReturnToChannelsButton.propTypes = {
  className: PropTypes.string,
};

export default observer(ReturnToChannelsButton);
