import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import Skeleton from 'react-loading-skeleton';
import { action } from 'mobx';
import { navigate, useLocation } from '@reach/router';
import { composeAxiosPostRequest } from 'requests/helpers';
import { FeedbackBanner } from 'widgets';
import { StoresContext } from 'store/mobx';
import { COMMUNICATION_CHANNELS } from 'store/mobx/Common';
import PageLayout from 'pages/_PageLayout';
import { formatPrice } from 'utils/formatting';
import { ActionButton } from '../../components/buttons/ActionButtons';
import { NEW_CAMPAIGN_URL } from '../constants';
import { StepHeading, StepLayout } from './components';
import styles from './styles.pcss';

const ChooseChannels = () => {
  const { Common, NewCampaign, Templates } = useContext(StoresContext);
  const { title, description } = Templates.getNewCampaignTemplate('CampaignAudienceStep');
  const location = useLocation();
  useEffect(() => {
    if (location.search !== '?reset=false') {
      NewCampaign.resetCampaign();
    }
    Common.getCampaignsChannelTypes();
  }, []);

  const onClickHandler = action(async (item) => {
    if (NewCampaign.currentCampaign.id) {
      await composeAxiosPostRequest({
        url: `/api/v1/client/campaigns/${NewCampaign.currentCampaign.id}/add_order/${item.channel_uid}/`,
      });
    }
    NewCampaign.currentCampaign.channel_uid = item.channel_uid;
    navigate(`${NEW_CAMPAIGN_URL}name`);
  });

  return (
    <PageLayout>
      <StepLayout className={styles.section}>
        <div className={styles.infoWrapper}>
          <StepHeading
            title={title}
            description={description}
            className={styles.text}
          />
        </div>
      </StepLayout>
      <div className={`${styles.section} ${styles.row}`}>
        {
            Common.getChannelsCommunicationPage.map(item => {
              return (
                <div className={styles.wrapper} key={item.channel_uid} onClick={() => onClickHandler(item)}>
                  <div className={styles.title}><span className={styles.link}>{item.name}</span></div>
                  <div className={styles.price}>от <span className={styles.priceNumber}>{formatPrice(item.minimal_budget)}</span> ₽</div>
                  <div className={styles.description}>
                    {item.description}
                  </div>
                  <ActionButton
                    className={styles.btn}
                    iconSlug="arrowRightMinimal"
                  >
                    Выбрать
                  </ActionButton>
                </div>
              );
            })
          }
        {
            Common.channelTypesLoading &&
            COMMUNICATION_CHANNELS.map(item => {
              return (
                <div className={`${styles.wrapper} ${styles.item}`} key={item}>
                  <div className={styles.title}><Skeleton/></div>
                  <div className={styles.price}><span className={styles.priceNumber}><Skeleton/></span> </div>
                  <div className={styles.description}>
                    <Skeleton/>
                  </div>

                </div>
              );
            })
          }
        <div className={styles.banner}>
          <FeedbackBanner />
        </div>

      </div>

    </PageLayout>

  );
};

export default observer(ChooseChannels);
