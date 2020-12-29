import React from 'react';
import WebsiteAddressField from 'pages/NewCampaign/ChannelsBriefsPages/components/WebsiteAddressField';
import { useNormalizedPushFields } from '../hooks/use-normalized-push-fields';

const WebsiteAddressFieldSms = (props) => {
  const { urlAdvertiser } = useNormalizedPushFields();
  return (
    <WebsiteAddressField
      websiteTitle={urlAdvertiser.name}
      websiteDescription={urlAdvertiser.field}
      websiteExample={urlAdvertiser.infoText}
      {...props}
    />
  );
};

export default WebsiteAddressFieldSms;
