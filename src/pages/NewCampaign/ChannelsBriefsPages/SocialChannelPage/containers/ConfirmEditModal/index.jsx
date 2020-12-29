import classNames from 'classnames';
import React, { useContext } from 'react';
import { useNavigate } from '@reach/router';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { OverlayLoader, ReplaceLoader } from 'components/common/Loaders/components';
import { Heading } from 'components/layouts';
import commonStyles from 'styles/common.pcss';
import { PopupStateless, TotalCost } from 'components/common';
import { ActionButton } from 'components/buttons/ActionButtons';
import { MY_CAMPAIGNS_URL } from 'pages/constants';
import { StoresContext } from 'store/mobx';
import styles from 'components/modals/StartCampaignOrEditModal/styles.pcss';
import { scrollSmoothTo } from 'utils/scroll';
import ChannelsPriceList from 'pages/NewCampaign/components/ChannelsDiscountList';
import { useStartCampaignPrices } from 'hooks/use-start-campaign-prices';
import { getCampaignPromocodeData } from 'store/NewCampaign/campaign/selectors';

export default function CompleteModerationModal({ setIsModalOpened, isLoading }) {
  const { Templates } = useContext(StoresContext);

  const template = Templates.getNewCampaignTemplate('ConfirmTargetInternetModerationModal');
  const { withoutNdsAll } = Templates.getCommonTemplate('GeneralConstants');

  const { isValid } = useSelector(getCampaignPromocodeData).all || {};

  const navigate = useNavigate();

  const handleLeaveNavigate = async () => {
    await navigate(`${MY_CAMPAIGNS_URL}#success-start`);
    scrollSmoothTo(0);
  };

  const {
    totalBudgetToDto,
    totalBudgetToDtoWithDiscount,
    channelsPrices,
    isLoading: isLoadingActualCampaign,
    hasSomeDiscount,
  } = useStartCampaignPrices();

  return (
    <PopupStateless opened onClose={() => setIsModalOpened(false)}>
      <OverlayLoader isLoading={isLoading}>
        <div className={styles.content}>
          <Heading level={1} className={commonStyles['marb-m']}>
            {template.title}
          </Heading>

          <Heading
            level={3}
            className={classNames(styles.description, commonStyles['marb-m'])}
        >
            {template.description}
          </Heading>

          <ReplaceLoader
            className={styles.infoLoader}
            isLoading={isLoadingActualCampaign}
          >
            <ChannelsPriceList
              className={commonStyles['marb-m']}
              pricesList={channelsPrices}
            />

            <TotalCost
              prefix={template?.totalTitle}
              price={totalBudgetToDto}
              discountPrice={isValid && hasSomeDiscount && totalBudgetToDtoWithDiscount}
              isSecondaryPostfix
              postfix={withoutNdsAll}
            />
          </ReplaceLoader>

          <div className={styles.buttonsContainer}>
            <ActionButton
              onClick={handleLeaveNavigate}
              className={classNames(styles.button, styles.rightButton)}
              iconSlug="arrowRightLong"
          >
              {template.startButton}
            </ActionButton>
          </div>
        </div>
      </OverlayLoader>
    </PopupStateless>
  );
}

CompleteModerationModal.propTypes = {
  setIsModalOpened: PropTypes.func,
  isLoading: PropTypes.bool,
};
