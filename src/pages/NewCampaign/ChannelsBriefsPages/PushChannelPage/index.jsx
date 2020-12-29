import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import PageLayout from 'pages/_PageLayout';
import { SegmentationWrapper } from 'pages/NewCampaign/containers';
import { CHANNEL_STUB_PUSH } from 'constants/index';
import { getCampaignLoaders } from 'store/NewCampaign/campaign/selectors';
import { OverlayLoader } from 'components/common/Loaders/components';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from '../../../../containers/ChatWidget';
import PushOrderForm from './containers/PushOrderForm';
import PushOrderFormBody from './containers/PushOrderFormBody';

function PushChannelPage() {
  const { NewCampaign } = useContext(StoresContext);
  const isLoading = useSelector(getCampaignLoaders)[CHANNEL_STUB_PUSH];

  return (
    <PageLayout isLeftMenuHide>
      <SegmentationWrapper
        isSticky={false}
        isOpeningForbidden={
          NewCampaign.getCampaignPushOrder.is_editable &&
          NewCampaign.currentCampaign.status_id !== 5 &&
          NewCampaign.getCampaignPushOrder.status_id === 7
        }
      >
        <OverlayLoader isLoading={isLoading}>
          <PushOrderForm>
            <PushOrderFormBody />
          </PushOrderForm>
        </OverlayLoader>
      </SegmentationWrapper>

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}

export default observer(PushChannelPage);
