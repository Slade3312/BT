import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { action, toJS } from 'mobx';
import { useParams } from '@reach/router';
import { useFormState } from 'react-final-form';
import { observer } from 'mobx-react';
import commonStyles from 'styles/common.pcss';
import { StoresContext } from 'store/mobx';
import { formatPriceWithLabel } from 'utils/formatting';
import PromocodeField from 'components/common/PromocodeField';
import { useFieldChangeDetector } from 'hooks/use-fields-change-detector';
import { useRequestPromocodeData } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-request-promocode-data.js';
import TotalOrderLine from 'pages/NewCampaign/ChannelsBriefsPages/components/TotalOrderInfo/components/TotalOrderLine';
import { ACTIVITY_FIELD, ORDER_CONNECTION_TYPE } from 'store/NewCampaign/channels/constants';
import { NEW_CAMPAIGN_CHANNELS } from 'store/constants';
import styles from './styles.pcss';

function TotalOrderVoiceLayout({
  children,
  budget,
  eventsCost,
  totalCount,
  perEventName,
  totalTitle,
  budgetTitle,
  costTitle,
  channelType,
}) {
  const { Templates, NewCampaign } = useContext(StoresContext);
  const promocodeData = NewCampaign.currentCampaign.promocode || {};
  const setPromocodeDataAction = action((data) => {
    NewCampaign.currentCampaign.promocode = data;
  });

  const { campaignId } = useParams();
  const { withoutNdsAll } = Templates.getCommonTemplate('GeneralConstants');
  const { channelHasChangedMessage } = Templates.getCommonTemplate('PromocodeField');

  useFieldChangeDetector(() => {
    if (promocodeData.isValid && !promocodeData.isOverdue) {
      NewCampaign.currentCampaign.promocode = {
        isOverdue: true, isValid: false, code: '',
      };
    }
  });

  const promocodeRequestData = {};

  const { values } = useFormState();
  const {
    [ORDER_CONNECTION_TYPE]: connectionType,
    [ACTIVITY_FIELD]: activity,
  } = values;

  let countNameCalculated;

  if (connectionType === 1) {
    countNameCalculated = 'Количество номеров для обзвона';
  }
  if (connectionType === 2) {
    countNameCalculated = 'Количество заинтересованных абонентов';
  }

  return (
    <div className={styles.component}>
      <div className={commonStyles['marb-m']}>
        <PromocodeField
          appliedPromocode={promocodeData.code}
          requiredChannel={channelType}
          onSetData={setPromocodeDataAction}
          isConfirmed={promocodeData.isValid}
          campaignId={campaignId}
          allowedParticularChannels={NEW_CAMPAIGN_CHANNELS}
          isLightButton
          requestData={promocodeRequestData}
        />

        {!promocodeData?.isValid && promocodeData?.isOverdue && (
          <div className={styles.promocodeInfo}>
            {channelHasChangedMessage}
          </div>
        )}
      </div>

      <TotalOrderLine
        isBigTitle
        title={totalTitle}
        description={withoutNdsAll}
      />

      <div className={styles.description}>
        <TotalOrderLine
          title={budgetTitle}
          description={budget}
          discountPrice={promocodeData.isValid && formatPriceWithLabel(NewCampaign.getPriceWithPromocode)}
        />

        {connectionType !== 3 && (
          <>
            <TotalOrderLine
              title={`${costTitle} ${perEventName}`}
              description={connectionType === 2 && !activity?.id ? `от ${eventsCost}` : eventsCost}
            />

            <div className={styles.bottomLine}>
              <div className={styles.titleRow}>
                {countNameCalculated}
              </div>

              <span>{totalCount}</span>
            </div>
          </>
        )}
      </div>

      {children}
    </div>
  );
}

TotalOrderVoiceLayout.propTypes = {
  children: PropTypes.node,
  channelType: PropTypes.string,
  totalCount: PropTypes.string,
  eventsCost: PropTypes.string,
  budget: PropTypes.string,
  perEventName: PropTypes.string,
  totalTitle: PropTypes.string,
  budgetTitle: PropTypes.string,
  costTitle: PropTypes.string,
};

export default observer(TotalOrderVoiceLayout);
