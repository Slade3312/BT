import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { navigate, useParams } from '@reach/router';
import { observer } from 'mobx-react';
import { SubHeadline } from 'components/layouts';
import commonStyles from 'styles/common.pcss';
import { TotalCost } from 'components/common';
import { getCampaignPromocodeData } from 'store/NewCampaign/campaign/selectors';
import {
  getCampaignTotalBlockDescription,
  getCampaignTotalBlockTitle, getStepChannelsContentStartButtonText,
} from 'store/common/templates/newCampaign/selectors';
import { setPromocodeByExistingChannels } from 'store/NewCampaign/campaign/actions';
import PromocodeField from 'components/common/PromocodeField';
import { StoresContext } from 'store/mobx';
import { NEW_CAMPAIGN_CHANNELS } from 'store/constants';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import { usePromocodeChannelsDiscountMap } from '../../hooks/use-promocode-channels-discount-map';
import { StepNavButton } from '../../../containers';
import { useBudgetByChannels } from '../../hooks/use-budget-by-channels';
import { useRequestPromocodeData } from '../../hooks/use-request-promocode-data';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

function TotalGeneralBlock({
  onButtonClick,
}) {
  const dispatch = useDispatch();
  const { Templates, NewCampaign } = useContext(StoresContext);
  const { withoutNds } = Templates.getCommonTemplate('GeneralConstants');
  const { campaignHasChangedMessage } = Templates.getCommonTemplate('PromocodeField');

  const { campaignId } = useParams();

  const title = useSelector(getCampaignTotalBlockTitle);
  const description = useSelector(getCampaignTotalBlockDescription);
  const startButtonText = useSelector(getStepChannelsContentStartButtonText);
  const promocodeData = useSelector(getCampaignPromocodeData).all || {};
  const setPromocodeDataAction = (data) => dispatch(setPromocodeByExistingChannels(data));
  const campaignOrders = useGetCampaignOrderForms();

  const discountsChannelsMap = usePromocodeChannelsDiscountMap();
  const budgetByChannelsMap = useBudgetByChannels();

  const totalBudget = Object.values(budgetByChannelsMap).reduce((acc, next) => acc + +next, 0);
  const totalBudgetToDtoWithDiscount = Object.keys(budgetByChannelsMap).reduce((acc, channelType) => {
    const curChannelInPromocode = discountsChannelsMap[channelType];
    if (curChannelInPromocode && typeof curChannelInPromocode.discountPrice === 'number') {
      return acc + curChannelInPromocode.discountPrice;
    }
    return acc + budgetByChannelsMap[channelType];
  }, 0);
  const hasSomeDiscount = Object.keys(campaignOrders).some(channelType => campaignOrders[channelType].isActive && discountsChannelsMap[channelType]);
  const promocodeRequestData = useRequestPromocodeData();
  return (
    <div>
      <div className={commonStyles['marb-m']}>
        {NewCampaign.currentCampaign.status_id === 5 && (
          <PromocodeField
            appliedPromocode={promocodeData.code}
            onSetData={setPromocodeDataAction}
            isConfirmed={promocodeData.isValid}
            campaignId={campaignId}
            allowedParticularChannels={NEW_CAMPAIGN_CHANNELS}
            requestData={promocodeRequestData}
          />
        )}

        {!promocodeData?.isValid && promocodeData?.isOverdue && (
          <div className={styles.promocodeInfo}>
            {campaignHasChangedMessage}
          </div>)
        }
      </div>

      <TotalCost
        prefix={title}
        className={cx('marb-m')}
        price={totalBudget}
        discountPrice={promocodeData.isValid && hasSomeDiscount && totalBudgetToDtoWithDiscount}
        postfix={withoutNds}
      />

      {NewCampaign.currentCampaign.status_id === 5 && (
        <SubHeadline className={cx('description', 'marb-l')}>
          {description}
        </SubHeadline>
      )}

      {NewCampaign.currentCampaign.status_id === 5 ? (
        <StepNavButton onClick={onButtonClick}>
          {startButtonText}
        </StepNavButton>
      ) : (
        <StepNavButton onClick={() => navigate('/my-campaigns/')}>
          Мои кампании
        </StepNavButton>
      )}
    </div>
  );
}

TotalGeneralBlock.propTypes = {
  onButtonClick: PropTypes.func,
};

export default observer(TotalGeneralBlock);
