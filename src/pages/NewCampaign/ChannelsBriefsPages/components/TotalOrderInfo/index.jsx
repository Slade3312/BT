import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from '@reach/router';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import commonStyles from 'styles/common.pcss';
import { StoresContext } from 'store/mobx';
import { formatPriceWithLabel } from 'utils/formatting';
import PromocodeField from 'components/common/PromocodeField';
import { useFieldChangeDetector } from 'hooks/use-fields-change-detector';
import TotalOrderLine from 'pages/NewCampaign/ChannelsBriefsPages/components/TotalOrderInfo/components/TotalOrderLine';
import { NEW_CAMPAIGN_CHANNELS } from 'store/constants';
import styles from './styles.pcss';

function TotalOrderInfo({
  children,
  budget,
  eventsCost,
  totalCount,
  perEventName,
  totalTitle,
  budgetTitle,
  costTitle,
  countName,
  channelType,
  isOnModeration,
}) {
  const { NewCampaign, Templates } = useContext(StoresContext);

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

  const promocodeRequestData = NewCampaign.calculate;
  return (
    <div className={styles.component}>
      {!isOnModeration &&
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
      }

      <TotalOrderLine
        isBigTitle
        title={totalTitle}
        description={withoutNdsAll}
      />

      <div className={styles.description}>
        <TotalOrderLine
          title={budgetTitle}
          description={budget}
          discountPrice={
            promocodeData.isValid &&
            formatPriceWithLabel(NewCampaign.getPriceWithPromocode)
          }
        />

        {perEventName && <TotalOrderLine
          title={`${costTitle} ${perEventName}`}
          description={eventsCost}
        />}

        <TotalOrderLine title={countName} description={totalCount} />
      </div>

      {children}
    </div>
  );
}

TotalOrderInfo.propTypes = {
  children: PropTypes.node,
  channelType: PropTypes.string,
  totalCount: PropTypes.string,
  eventsCost: PropTypes.string,
  budget: PropTypes.string,
  perEventName: PropTypes.string,
  totalTitle: PropTypes.string,
  budgetTitle: PropTypes.string,
  costTitle: PropTypes.string,
  countName: PropTypes.string,
  isOnModeration: PropTypes.bool,
};

export default observer(TotalOrderInfo);
