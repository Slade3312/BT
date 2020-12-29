import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';
import { CardGrid, BannerCard } from 'pages/Dashboard/components';

const ChannelsCards = ({ isMobile, className }) => {
  const { Templates, NewCampaign } = useContext(StoresContext);
  const { dashboard } = Templates.data;
  return (
    <CardGrid isMobile={isMobile} className={className}>
      {dashboard?.ChannelsCards?.items.map(item => (
        <BannerCard {...item}
          onClick={() => {
            if (item.slug) {
              NewCampaign.currentCampaign.channel_uid = item.slug;
            }
          }}
          key={item.id}
        />
      ))}
    </CardGrid>
  );
};

ChannelsCards.propTypes = {
  isMobile: PropTypes.bool,
  className: PropTypes.string,
};

export default observer(ChannelsCards);
