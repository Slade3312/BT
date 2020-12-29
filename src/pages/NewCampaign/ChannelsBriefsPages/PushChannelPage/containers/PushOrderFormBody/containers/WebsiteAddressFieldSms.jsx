import React from 'react';
import { useNormalizedPushFields } from '../hooks/use-normalized-push-fields';
import WebsiteAddressField from '../../../../components/WebsiteAddressField';

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
