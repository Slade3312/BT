import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { StoresContext } from 'store/mobx';
import GroupContent from './components/GroupContent';

const TaxonsGroupsTable = () => {
  const { NewCampaign } = useContext(StoresContext);

  const handleTaxonReset = (data) => {
    NewCampaign.removeTaxonFromSelected(data);
  };

  return (
    <div>
      {NewCampaign.taxonsGroupsListWithWebAndPhones.map(({ slug, items, title, text, isDisabled }) => (
        <GroupContent
          key={`${title}-${slug}`}
          slug={slug}
          text={text}
          items={toJS(items)}
          title={title}
          isDisabled={isDisabled}
          onTabRemove={handleTaxonReset}
        />
      ))}
    </div>
  );
};

export default observer(TaxonsGroupsTable);
