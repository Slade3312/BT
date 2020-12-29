import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { filterNewCampaignChannels } from 'store/utils';

import SideMenu from 'components/layouts/SideMenu';
import { pushClickLeftNavToGA } from 'components/layouts/SideMenu/ga/utils';

const MainMenu = () => {
  const {
    Templates: { getTemplate, getDashboardTemplate },
    Common,
    NewCampaign,
  } = useContext(StoresContext);

  const [sideMenuList, setSideMenuList] = useState([]);

  useEffect(() => {
    const campaignChannelTypes = filterNewCampaignChannels(Common.channelTypes);

    const result = async () => {
      // TODO шаблон dashboard нужен для левого меню. Переместить левое меню в Common
      await getTemplate('dashboard');
      const templateList = getDashboardTemplate('SideMenuList') || [];

      setSideMenuList(templateList?.map((item) => {
        if (item.slug === 'create') {
          return {
            ...item,
            subItems: campaignChannelTypes.map(({ channel_uid: channelUid, name }) => ({
              slug: channelUid,
              title: name,
              href: '/new-campaign/name',
            })),
          };
        }
        if (item.slug === 'polls_promo') {
          return { ...item, isCustom: true };
        }
        return item;
      }));
    };
    result();
  }, []);

  const handleItemClick = ({ slugItem, subSlugItem }) => {
    if (subSlugItem) {
      NewCampaign.resetCampaign();
      NewCampaign.currentCampaign.channel_uid = subSlugItem.slug;
    }
    pushClickLeftNavToGA({ slugTitle: slugItem.title });
  };

  return (
    <SideMenu
      items={sideMenuList}
      onItemClick={handleItemClick}
    />
  );
};

export default observer(MainMenu);
