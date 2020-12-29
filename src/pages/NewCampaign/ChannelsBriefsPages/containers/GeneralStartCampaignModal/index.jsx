import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react';
import { PopupStateless } from 'components/common/Popup/components/Popup';
import { ActionButton } from 'components/buttons/ActionButtons';
import { OverlayLoader, TotalCost } from 'components/common';
import commonStyles from 'styles/common.pcss';
import { Heading } from 'components/layouts';
import { getGeneralStartCampaignModal } from 'store/common/templates/newCampaign/selectors';
import {
  getCampaignLoaders, getCampaignPromocodeData,
} from 'store/NewCampaign/campaign/selectors';
import { useStartCampaignPrices } from 'hooks/use-start-campaign-prices';
import { CAMPAIGN_START } from 'constants/index';
import { ReplaceLoader } from 'components/common/Loaders';
import { StoresContext } from 'store/mobx';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import EmptyChannelsList from '../EmptyChannelsList';
import ChannelsPriceList from '../../../components/ChannelsDiscountList';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

function GeneralStartCampaignModal({
  setIsOpenedModal,
  onStartCampaign,
}) {
  const content = useSelector(getGeneralStartCampaignModal);
  const orderForms = useGetCampaignOrderForms();
  const promocodeData = useSelector(getCampaignPromocodeData).all || {};

  const { Templates } = useContext(StoresContext);
  const { withoutNdsAll } = Templates.getCommonTemplate('GeneralConstants');

  const {
    totalBudgetToDto,
    totalBudgetToDtoWithDiscount,
    channelsPrices,
    isLoading: isLoadingActualCampaignData,
    hasSomeDiscount,
  } = useStartCampaignPrices();

  const activeChannelsCount = Object.values(orderForms).filter((order) => order.isActive).length;
  const activeEmptyChannelsCount = Object.values(orderForms).filter((order) => order.isActive && order.isEmpty).length;

  const isCampaignStartLoading = useSelector(getCampaignLoaders)[
    CAMPAIGN_START
  ];

  let renderModalType = null;

  if (activeChannelsCount === 0) {
    renderModalType = 'noSelectedChannels';
  } else if (activeEmptyChannelsCount > 0) {
    if (activeEmptyChannelsCount === activeChannelsCount) {
      renderModalType = 'fillAtLeastOneChannel';
    } else {
      renderModalType = 'fillNotSavedChannels';
    }
  } else {
    renderModalType = 'allSelectedChannelsSaved';
  }

  const DiscountInfo = useCallback(
    () => (
      <ReplaceLoader isLoading={isLoadingActualCampaignData} className={styles.infoLoader}>
        <ChannelsPriceList
          className={commonStyles['marb-m']}
          pricesList={channelsPrices}
          />


        <TotalCost
          prefix={content?.totalTitle}
          price={totalBudgetToDto}
          discountPrice={promocodeData.isValid && hasSomeDiscount && totalBudgetToDtoWithDiscount}
          isSecondaryPostfix
          postfix={withoutNdsAll}
        />
      </ReplaceLoader>
    ),
    [promocodeData, content, totalBudgetToDto, totalBudgetToDtoWithDiscount, channelsPrices],
  );

  return (
    <PopupStateless opened onClose={() => setIsOpenedModal(false)}>
      <OverlayLoader isLoading={isCampaignStartLoading}>
        <div className={cx('content')}>
          <Heading level={1} className={cx('marb-m')}>
            {content.title}
          </Heading>

          {renderModalType === 'noSelectedChannels' && (
            <>
              <Heading level={3} className={cx('description', 'marb-l')}>
                {content.descriptionNoSelectedChannels}
              </Heading>

              <div className={cx('buttonsContainer')}>
                <ActionButton
                  className={cx('button')}
                  onClick={() => setIsOpenedModal(false)}
                >
                  {content.editButton}
                </ActionButton>
              </div>
            </>
          )}

          {renderModalType === 'fillAtLeastOneChannel' && (
            <>
              <Heading level={3} className={cx('description', 'marb-l')}>
                {content.descriptionFillingRequired}
              </Heading>

              <EmptyChannelsList className={cx('helpInfo', 'marb-m')} />

              <div className={cx('buttonsContainer')}>
                <ActionButton
                  className={cx('button')}
                  onClick={() => setIsOpenedModal(false)}
                >
                  {content.editButton}
                </ActionButton>
              </div>
            </>
          )}

          {renderModalType === 'fillNotSavedChannels' && (
            <>
              <Heading level={3} className={cx('description', 'marb-l')}>
                {content.descriptionSomeFillingRequired}
              </Heading>

              <DiscountInfo />

              <div className={cx('buttonsContainer')}>
                <ActionButton
                  className={cx('button')}
                  onClick={() => setIsOpenedModal(false)}
                >
                  {content.editButton}
                </ActionButton>

                <ActionButton
                  onClick={onStartCampaign}
                  className={cx('button', 'rightButton')}
                  isDisabled={isLoadingActualCampaignData}
                  iconSlug="arrowRightLong"
                >
                  {content.startButton}
                </ActionButton>
              </div>
            </>
          )}

          {renderModalType === 'allSelectedChannelsSaved' && (
            <>
              <Heading level={3} className={cx('description', 'marb-l')}>
                {content.descriptionAllChannelsSaved}
              </Heading>

              <DiscountInfo />

              <div className={cx('buttonsContainer')}>
                <ActionButton
                  className={cx('button')}
                  onClick={() => setIsOpenedModal(false)}
                >
                  {content.editButton}
                </ActionButton>

                <ActionButton
                  onClick={onStartCampaign}
                  className={cx('button', 'rightButton')}
                  isDisabled={isLoadingActualCampaignData}
                  iconSlug="arrowRightLong"
                >
                  {content.startButton}
                </ActionButton>
              </div>
            </>
          )}
        </div>
      </OverlayLoader>
    </PopupStateless>
  );
}

GeneralStartCampaignModal.propTypes = {
  setIsOpenedModal: PropTypes.func,
  onStartCampaign: PropTypes.func,
};

export default observer(GeneralStartCampaignModal);
