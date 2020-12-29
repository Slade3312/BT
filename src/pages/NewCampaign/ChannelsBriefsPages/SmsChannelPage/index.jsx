import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import PageLayout from 'pages/_PageLayout';
import { SegmentationWrapper } from 'pages/NewCampaign/containers';
import { OverlayLoader } from 'components/common/Loaders/components';
import { getCampaignLoaders } from 'store/NewCampaign/campaign/selectors';
import { CHANNEL_STUB_SMS } from 'constants/index';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from '../../../../containers/ChatWidget';
import { SmsOrderFormBody } from './containers/SmsOrderFormBody';
import { SmsOrderForm } from './containers';

function SmsChannelPage() {
  const { NewCampaign } = useContext(StoresContext);
  const isLoading = useSelector(getCampaignLoaders)[CHANNEL_STUB_SMS];

  return (
    <PageLayout isLeftMenuHide>
      <SegmentationWrapper
        isSticky={false}
        isOpeningForbidden={
          NewCampaign.getCampaignTargetSmSOrder.is_editable &&
          NewCampaign.currentCampaign.status_id !== 5 &&
          NewCampaign.getCampaignTargetSmSOrder.status_id === 7
        }
      >
        <OverlayLoader isLoading={isLoading}>
          <SmsOrderForm>
            <SmsOrderFormBody />
          </SmsOrderForm>
        </OverlayLoader>
      </SegmentationWrapper>

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}

export default observer(SmsChannelPage);
