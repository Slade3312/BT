import React, { useContext } from 'react';
import { useLocation } from '@reach/router';
import { observer } from 'mobx-react';
import SideMenu from 'components/layouts/SideMenu';
import { pushClickLeftNavToGA } from 'components/layouts/SideMenu/ga/utils';

import { StoresContext } from 'store/mobx/index';

const NewCampaignSidebar = () => {
  const { NewCampaign } = useContext(StoresContext);
  const { channel_uid, id, status_id } = NewCampaign.currentCampaign;
  const location = useLocation();
  const items = [{
    title: 'Выбор канала коммуникации',
    icon: 'https://static.beeline.ru/upload/images/marketing/menu-logo-speaker.svg',
    href: '',
    slug: '',
    isDisabled: (!!(id) || status_id === 5),
    isActive: false,
    subSteps: [],
  }, {
    title: 'Профиль кампании',
    icon: 'https://static.beeline.ru/upload/images/marketing/menu-logo-equalizer.svg',
    href: 'name',
    slug: 'name',
    isDisabled: !(channel_uid) || status_id === 5 || status_id === 1,
    isActive: true,
    subSteps: [],
  }, {
    title: 'Выбор аудитории',
    icon: 'https://static.beeline.ru/upload/images/marketing/menu-logo-chartPie.svg',
    slug: 'audience',
    href: `${id}/audience`,
    isDisabled: !(channel_uid && id),
    isActive: false,
    subSteps: NewCampaign.subItemsWithWebAndPhones,
  }, {
    title: 'Заполнить бриф',
    icon: 'https://static.beeline.ru/upload/images/marketing/menu-logo-docList.svg',
    slug: 'brief',
    href: `${id}/channels/${channel_uid}`,
    isDisabled: !(channel_uid && id),
    isActive: false,
    subSteps: [],
  }];

  const pathname = location.pathname;

  const handleItemClick = ({ slugItem, subSlugItem = {} }) => {
    changeStepWithGA({ slugItem, subSlugItem });
  };

  const isPathActive = ({ href }) => {
    const path = `/new-campaign/${href}`;
    return path === pathname;
  };

  const checkSubItemPaths = (subItems, slug) => {
    return subItems.some(subItem => {
      return `/new-campaign/${id}/${slug}/${subItem.slug}` === pathname;
    });
  };

  const changeStepWithGA = ({ slugItem, subSlugItem = {} }) => () => {
    pushClickLeftNavToGA({ slugTitle: slugItem.title, subSlugTitle: subSlugItem.title });
  };

  const getNewCampaignItems = () => items.map((item, index) => {
    return {
      title: item.title,
      icon: item.icon,
      href: item.href,
      isDisabled: item.isDisabled,
      isActive: isPathActive(item),
      subItems: (isPathActive(item) || checkSubItemPaths(item.subSteps, item.slug)) ? item.subSteps.filter(menuItem => menuItem.slug !== 'geo').map(subStep => ({
        title: subStep.title,
        href: `/new-campaign/${id}/${item.slug}/${subStep.slug}`,
        isActive: `/new-campaign/${id}/${item.slug}/${subStep.slug}` === pathname,
      })) : [],
      isCustom: item.isCustom,
    };
  });

  return (
    <SideMenu
      title="Создание кампании"
      items={getNewCampaignItems()}
      onItemClick={handleItemClick}
    />
  );
};

export default observer(NewCampaignSidebar);

