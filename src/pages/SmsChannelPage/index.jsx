import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import PageLayout from 'pages/_PageLayout';
import { SegmentationWrapper } from 'pages/NewCampaign/containers';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from 'containers/ChatWidget';
import { PageLoader } from '../../components/common/Loaders/components';
import { SmsOrderForm } from './containers';
import { SmsOrderFormBody } from './containers/SmsOrderFormBody';


function SmsChannelPage() {
  const { NewCampaign } = useContext(StoresContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingCalendarData = async () => {
      setLoading(true);
      try {
        await NewCampaign.getChannelOffsetDateStart();

        await NewCampaign.getOrdersHolidays('sms');
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
          NewCampaign.getCampaignTargetSmSOrder.is_editable &&
          NewCampaign.currentCampaign.status_id !== 5 &&
          NewCampaign.getCampaignTargetSmSOrder.status_id === 7
        }
      >
        <PageLoader isLoading={loading}>
          <SmsOrderForm>
            <SmsOrderFormBody />
          </SmsOrderForm>
        </PageLoader>
      </SegmentationWrapper>

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}

export default observer(SmsChannelPage);
