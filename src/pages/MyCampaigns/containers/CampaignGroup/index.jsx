import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { ActionButton, DeleteButton, IconLink } from 'components/buttons';
import { RemoveCampaignModal } from 'components/modals';
import commonStyles from 'styles/common.pcss';
import { NEW_CAMPAIGN_URL, FILE_TYPES } from 'pages/constants';
import { formatDateBySplitter } from 'utils/date';
import { getTranslatedOrderStatusById } from 'store/common/ordersStatuses/utils';
import { scrollTo } from 'utils/scroll';
import {
  CAMPAIGN_STATUSES,
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_TARGET_INTERNET,
  ORDER_STATUSES,
} from 'constants/index';
import {
  LimitedTextContainer,
  ColumnCell,
  ListRowContainer,
  DateContainer,
} from '../../components';
import styles from './styles.pcss';

const cx = classNames.bind({ ...styles, ...commonStyles });

const getIsTargetInternetInModeration = (campaign, targetInternetOrder) => {
  const isHasMyTargetErrors =
    targetInternetOrder?.moderation_comment ||
    targetInternetOrder?.data?.my_target_banner_moderation_reasons?.length > 0;

  return (
    campaign.status_id === CAMPAIGN_STATUSES.ON_APPROVAL &&
    isHasMyTargetErrors &&
    targetInternetOrder?.status_id === ORDER_STATUSES.IN_PROGRESS
  );
};

function CampaignGroup({ item }) {
  const { MyCampaigns, Social } = useContext(StoresContext);
  const { syncRemoveCampaign } = MyCampaigns;
  const { resetInternetTargetData: onResetCampaign } = Social;
  const [isModalOpened, setIsModalOpened] = useState(false);
  const {
    name: campaignName,
    id: campaignId,
    status: campaignStatus,
    orders,
    status_id: campaignStatusId,
    create_date: createDate,
  } = item;

  const isCampaignInDraft = campaignStatusId === CAMPAIGN_STATUSES.DRAFT;
  const campaignCreateDate = createDate ? formatDateBySplitter(createDate) : '';

  const getReportLink = (filesArray) => {
    const orderReport = filesArray?.find(
      (elem) => elem.type_id === FILE_TYPES.ORDER_REPORT
    );
    return orderReport ? orderReport.file : '';
  };

  const getMediaplanLink = (filesArray) => {
    const orderMediaplan = filesArray?.find(
      (elem) => elem.type_id === FILE_TYPES.MEDIA_PLAN
    );
    return orderMediaplan ? orderMediaplan.file : '';
  };

  const handleEditClick = async () => {
    onResetCampaign();
    await navigate(`${NEW_CAMPAIGN_URL}${campaignId}/audience`);
    scrollTo(0);
  };

  const handleEditChannel = async (elem) => {
    onResetCampaign();
    await navigate(`${NEW_CAMPAIGN_URL}${campaignId}/channels/${elem.channel_uid}`);
    scrollTo(0);
  };

  const handleTargetInternetModerationClick = async () => {
    onResetCampaign();
    await navigate(`${NEW_CAMPAIGN_URL}${campaignId}/channels/target-internet`);
    scrollTo(0);
  };

  const handleCampaignDelete = async () => {
    await syncRemoveCampaign(campaignId);
    setIsModalOpened(false);
  };

  return (
    <li className={cx('component', { draftStatus: isCampaignInDraft })}>
      <ColumnCell type={ColumnCell.propConstants.types.name}>
        <LimitedTextContainer
          className={cx('campaignName')}
          hasNoGradient={isCampaignInDraft}
        >
          {campaignName}
        </LimitedTextContainer>
      </ColumnCell>

      {isCampaignInDraft && (
        <React.Fragment>
          {orders.length && orders.map((elem) => {
            return (
              <ColumnCell type={ColumnCell.propConstants.types.channel} key={elem.id}>
                {elem.channel_type && (
                  <LimitedTextContainer draft>
                    {elem.channel_type}
                  </LimitedTextContainer>
                )}
              </ColumnCell>
            );
          }) || <LimitedTextContainer draft/>}
          <ColumnCell type={ColumnCell.propConstants.types.status}>
            {campaignStatus}
          </ColumnCell>

          <ColumnCell
            type={ColumnCell.propConstants.types.date}
            className={cx('dateCell')}
          >
            {campaignCreateDate && <span>старт {campaignCreateDate}</span>}
          </ColumnCell>

          <ActionButton
            type="button"
            className={cx('editButton')}
            onClick={handleEditClick}
          >
            Редактировать
          </ActionButton>

          <DeleteButton onClick={() => setIsModalOpened(true)} />
        </React.Fragment>
      )}

      {/* show all orders data */}
      {!isCampaignInDraft && orders?.length ? (
        <div className={cx('ordersContainer')}>
          {orders.map((elem) => {
            const orderStatus = getTranslatedOrderStatusById(elem.status_id);
            const curCreateDate = elem.date_start ? formatDateBySplitter(elem.date_start) : '';
            const endingDate = elem.date_end ? formatDateBySplitter(elem.date_end) : '';
            const reportLink = getReportLink(elem.files);
            const mediaplanLink = getMediaplanLink(elem.files);

            const isTargetModerationOrder = elem.channel_uid === CHANNEL_STUB_TARGET_INTERNET ? getIsTargetInternetInModeration(item, elem) : false;

            const getItemStatusText = () => {
              if (isTargetModerationOrder) {
                return 'Не прошла модерацию';
              }
              if (isCampaignInDraft) {
                return campaignStatus;
              }
              return orderStatus;
            };

            return (
              <ListRowContainer key={elem.id}>
                <ColumnCell type={ColumnCell.propConstants.types.channel}>
                  {elem.channel_type && (
                    <LimitedTextContainer>
                      {elem.channel_type}
                    </LimitedTextContainer>
                  )}
                </ColumnCell>

                <ColumnCell
                  className={isTargetModerationOrder ? styles.error : ''}
                  type={ColumnCell.propConstants.types.status}
                >
                  <LimitedTextContainer>
                    {getItemStatusText()}
                  </LimitedTextContainer>
                </ColumnCell>

                <ColumnCell type={ColumnCell.propConstants.types.date}>
                  <DateContainer>
                    {curCreateDate && <span>старт {curCreateDate}</span>}

                    {endingDate && <span>завершится {endingDate}</span>}
                  </DateContainer>
                </ColumnCell>

                {elem.channel_uid === CHANNEL_STUB_INTERNET && (
                  <ColumnCell type={ColumnCell.propConstants.types.right}>
                    <IconLink
                      href={mediaplanLink}
                      slug="writedPaper"
                      className={cx('IconLink')}
                      isDisabled={!mediaplanLink.length}
                      target="_blank"
                    >
                      Медиаплан
                    </IconLink>
                  </ColumnCell>
                )}

                {isTargetModerationOrder && (
                  <ActionButton
                    type="button"
                    className={cx('editButton')}
                    onClick={handleTargetInternetModerationClick}
                  >
                    Изменить бриф
                  </ActionButton>
                )}

                {
                  elem.is_editable && !isTargetModerationOrder &&
                  <ActionButton
                    type="button"
                    className={cx('editButton')}
                    onClick={() => handleEditChannel(elem)}
                  >
                    Изменить бриф
                  </ActionButton>
                }

                <ColumnCell type={elem.channel_uid !== CHANNEL_STUB_INTERNET ? ColumnCell.propConstants.types.right : null}>
                  <IconLink
                    href={reportLink}
                    className={cx('IconLink')}
                    isDisabled={!reportLink.length}
                    target="_blank"
                    >
                    Отчёт
                  </IconLink>
                </ColumnCell>

              </ListRowContainer>
            );
          })}
        </div>
      ) : null}

      {isModalOpened && (
        <RemoveCampaignModal
          title="Удалить кампанию?"
          description="Кампания перестанет быть доступна, как только вы нажмёте «Удалить»."
          onClose={() => setIsModalOpened(false)}
          buttonDecline={{
            text: 'Отменить',
          }}
          buttonConfirm={{
            text: 'Удалить',
            onClick: handleCampaignDelete,
          }}
        />
      )}
    </li>
  );
}

CampaignGroup.propTypes = {
  item: PropTypes.object,
};

export default observer(CampaignGroup);
