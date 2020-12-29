import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { HeadBlock } from '../../components';

const HeadFocus = ({ className }) => {
  const {
    Templates: {
      getAudienceStatisticTemplate,
    },
  } = useContext(StoresContext);
  const { title, description, ticketMessage } = getAudienceStatisticTemplate('MainHeading');
  return (
    <HeadBlock ticketMessage={ticketMessage} title={title} className={className} description={description} />
  );
};

HeadFocus.propTypes = {
  className: PropTypes.string,
};

export default observer(HeadFocus);
