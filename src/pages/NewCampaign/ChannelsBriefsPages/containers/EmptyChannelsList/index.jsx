import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { navigate } from '@reach/router';
import { observer } from 'mobx-react';
import { getChannelsWidgetsCardsItemsByIds } from 'store/common/templates/newCampaign/selectors';
import { getCampaignPromocodeData } from 'store/NewCampaign/campaign/selectors';
import { IconLink } from 'components/buttons';
import { StoresContext } from 'store/mobx';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import styles from './styles.pcss';

function EmptyChannelsList() {
  const { Templates } = useContext(StoresContext);
  const template = Templates.getNewCampaignTemplate('EmptyChannelsList');

  const orderForms = useGetCampaignOrderForms();
  const channelWidgetsInfo = useSelector(getChannelsWidgetsCardsItemsByIds);

  const emptyChannelTypes = Object.keys(orderForms).filter((key) => orderForms[key].isActive && orderForms[key].isEmpty);
  const promocodeData = useSelector(getCampaignPromocodeData).all || {};

  return (
    <div>
      {emptyChannelTypes.map((channelType) => {
        return (
          <div className={styles.item}>
            <div className={styles.titleCol}>
              {channelWidgetsInfo[channelType]?.title}
              {promocodeData.isValid && promocodeData?.channels?.find(item => item.channel_type === channelType) && (
                <span className={styles.discountInfo}>
                  {template?.discountInfo}
                </span>
              )}
            </div>
            <div className={styles.editButtonCol}>
              <IconLink
                onClick={() =>
                  navigate(`channels/${channelType}`)
                }
                className={styles.button}
                isIconBeforeText={null}
              >
                {template?.buttonLink}
              </IconLink>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default observer(EmptyChannelsList);
