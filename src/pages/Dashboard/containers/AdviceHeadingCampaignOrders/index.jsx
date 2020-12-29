import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import AdviceHeading from 'pages/Dashboard/components/AdviceHeading';

export default observer(() => {
  const { Templates } = useContext(StoresContext);
  const { dashboard } = Templates.data;

  return (
    <AdviceHeading
      title={dashboard?.AdviceHeadingCampaignOrders?.title}
      description={dashboard?.AdviceHeadingCampaignOrders?.description}
    />
  );
});
