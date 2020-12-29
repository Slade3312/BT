import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { PopupStateless } from 'components/common';
import { ReplaceLoader } from 'components/common/Loaders/components';
import {
  STEP_CALCULATE_COST,
  STEP_ERROR_CALCULATE_COST,
  STEP_ERROR_FILE_LOADING,
  STEP_ERROR_PREPARE_ORDER,
  STEP_ORDER_RESULT,
  TOO_MANY_REQUESTS,
} from 'store/mobx/constants';
import { pushToGA } from 'utils/ga-analytics/data-layer';
import {
  PopupContentWrapper,
  CalculateCostStep,
  ErrorLoadFile,
  ErrorCreateOrder,
  OrderResultStep,
  ErrorCalculateCost,
  ErrorTooManyRequests,
} from './components';

function EditCampaignStepper() {
  const { CreateReport, Templates } = useContext(StoresContext);

  const { title } = Templates.getAudienceStatisticTemplate('LoadBaseBanner');

  const getCurrentStepView = () => {
    switch (CreateReport.step) {
      // #1
      case STEP_ERROR_FILE_LOADING: {
        return <ErrorLoadFile />;
      }
      case STEP_ERROR_PREPARE_ORDER: {
        return <ErrorCreateOrder />;
      }
      // #3
      case STEP_CALCULATE_COST: {
        return <CalculateCostStep />;
      }
      case TOO_MANY_REQUESTS: {
        return <ErrorTooManyRequests />;
      }
      case STEP_ERROR_CALCULATE_COST: {
        return <ErrorCalculateCost />;
      }
      // #4
      case STEP_ORDER_RESULT: {
        return <OrderResultStep />;
      }
      default: {
        return null;
      }
    }
  };

  const handleCloseModal = () => {
    CreateReport.set('isModalVisible', false);
    if (CreateReport.step === STEP_CALCULATE_COST) {
      pushToGA({
        event: 'event_b2b_audienceAnalysis',
        action: 'cancel_Подтвердите заказ услуги',
        blockName: title,
      });
    }
  };

  return (
    <PopupStateless opened onClose={handleCloseModal}>
      <PopupContentWrapper>
        <ReplaceLoader isLoading={CreateReport.loading}>
          {getCurrentStepView()}
        </ReplaceLoader>
      </PopupContentWrapper>
    </PopupStateless>
  );
}

export default observer(EditCampaignStepper);
