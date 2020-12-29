import React, { useContext, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { getSelectedTaxonsGroupsList } from 'store/mobx/utils/taxons';
import { StoresContext } from 'store/mobx';

import { CompactGroupContent } from './components';
import styles from './styles.pcss';

const SegmentationCompactManager = () => {
  const { NewCampaign, WebsAndPhonesTaxons } = useContext(StoresContext);

  let steps = getSelectedTaxonsGroupsList(NewCampaign.allTaxonGroups, NewCampaign.currentCampaign.selection.data || {})
    .filter(group => !!group.items.length);

  if (
    (NewCampaign.currentCampaign.channel_uid === 'target-sms' || NewCampaign.currentCampaign.channel_uid === 'push') &&
    WebsAndPhonesTaxons.webSitesTaxon.manuallySites.length
  ) {
    steps = [...steps, {
      items: WebsAndPhonesTaxons.webSitesTaxon.manuallySites.map(stringItem => ({ label: stringItem, value: stringItem })),
      slug: 'webSites',
      title: WebsAndPhonesTaxons.webSitesOnOfLine === 'online' ? 'Онлайн Веб-сайты' : 'Офлайн Веб-сайты',
      isWithoutRemove: true,
    }];
  }

  if (
    (NewCampaign.currentCampaign.channel_uid === 'target-sms' || NewCampaign.currentCampaign.channel_uid === 'push') &&
    WebsAndPhonesTaxons.phoneNumbersTaxon.manuallyNumbers.length
  ) {
    steps = [...steps, {
      items: WebsAndPhonesTaxons.phoneNumbersTaxon.manuallyNumbers.map(stringItem => ({ label: stringItem, value: stringItem })),
      slug: 'phoneNumbers',
      title: 'Телефонные номера',
      isWithoutRemove: true,
    }];
  }

  const handleTaxonRemove = (data) => {
    NewCampaign.removeTaxonFromSelected(data);
  };

  return steps.length ? (
    steps.map(({ slug, items, title, isWithoutRemove }, index) => (
      <CompactGroupContent
        title={index === 0 ? 'Выбор аудитории' : null}
        key={title}
        items={items}
        slug={slug}
        subTitle={title}
        isWithoutRemove={isWithoutRemove}
        onTabRemove={handleTaxonRemove}
      />
    ))
  ) : (
    <span className={styles.emptyRow}>Фильтры не выбраны</span>
  );
};

export default observer(SegmentationCompactManager);
