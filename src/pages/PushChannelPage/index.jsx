import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import PageLayout from 'pages/_PageLayout';
import { SegmentationWrapper } from 'pages/NewCampaign/containers';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from 'containers/ChatWidget';
import { PageLoader } from 'components/common/Loaders/components';

import PushOrderForm from './containers/PushOrderForm';
import PushOrderFormBody from './containers/PushOrderFormBody';

function PushChannelPage() {
  const { NewCampaign } = useContext(StoresContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingCalendarData = async () => {
      setLoading(true);
      try {
        await NewCampaign.getChannelOffsetDateStart();

        await NewCampaign.getOrdersHolidays('push');
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    loadingCalendarData();
  }, []);

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
        <PageLoader isLoading={loading}>
          <PushOrderForm>
            <PushOrderFormBody />
          </PushOrderForm>
        </PageLoader>
      </SegmentationWrapper>

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}

export default observer(PushChannelPage);
