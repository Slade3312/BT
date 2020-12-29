import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react';
import { TotalOrderInfo } from 'pages/NewCampaign/ChannelsBriefsPages/components';
import { OrderSaveButton } from 'pages/NewCampaign/containers';
import {
  getInternetBriefFormOrderTotal,
  getInternetFormOrderEventsName,
} from 'store/common/templates/newCampaign/briefs-selectors';
import { formatFloatWithComma, formatPrice } from 'utils/formatting';
import { wordFormByCount } from 'utils/fn';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { useSubmitOrderForm } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-submit-order';
import { useSelectedMediaplanData } from 'pages/NewCampaign/ChannelsBriefsPages/InternetChannelPage/hooks/use-selected-mediaplan-data';
import { viewToDtoInternetChannel } from 'store/NewCampaign/storage/orders-view-to-dto';

const TotalInfoInternet = () => {
  const total = useSelector(getInternetBriefFormOrderTotal);
  const budgetEventsName = useSelector(getInternetFormOrderEventsName);

  const anchorRef = useRef();
  const { budget, totalEvents, averageCost } = useSelectedMediaplanData() || {};
  const eventsFormName = wordFormByCount(totalEvents, budgetEventsName);

  const onOrderSubmit = useSubmitOrderForm({
    channelType: CHANNEL_STUB_INTERNET,
    viewToDtoConverter: viewToDtoInternetChannel,
    anchorRef,
  });
  return (
    <div ref={anchorRef}>
      <TotalOrderInfo
        channelType={CHANNEL_STUB_INTERNET}
        totalCount={`${formatPrice(totalEvents)} ${eventsFormName}`}
        budget={`${formatPrice(budget)} ₽`}
        eventsCost={`${formatFloatWithComma(averageCost)} ₽`}
        perEventName={total.unitName}
        totalTitle={total.title}
        budgetTitle={total.budgetTitle}
        costTitle={total.costTitle}
        countName={total.countName}
      >
        <OrderSaveButton onClick={onOrderSubmit} isLight>
          {total.button}
        </OrderSaveButton>
      </TotalOrderInfo>
    </div>
  );
};

export default observer(TotalInfoInternet);
