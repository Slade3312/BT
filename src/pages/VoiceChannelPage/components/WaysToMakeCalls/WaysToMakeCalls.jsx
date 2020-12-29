import React, { useContext, useMemo } from 'react';
import { FormFieldLabel } from 'components/forms';
import { FFRadioGroup } from 'components/fields';
import { WAY_TO_MAKE_CALL } from 'store/NewCampaign/channels/constants';
import { StoresContext } from 'store/mobx';
import WayToMakeCallItem from '../WayToMakeCallItem/WayToMakeCallItem';
import styles from './styles.pcss';


const WaysToMakeCalls = () => {
  const { NewCampaign, Templates } = useContext(StoresContext);
  const { callMethods } = NewCampaign;
  const { waysToMakeCalls: { title, data } } = Templates.getNewCampaignTemplate('BriefOrderVoice');

  const callMethodsMerged = useMemo(() => {
    return callMethods.map((item, i) => {
      return {
        ...item,
        ...data[i],
        value: item.id,
      };
    });
  });

  return (
    <div className={styles.container}>
      <FormFieldLabel isBold>
        {title}
      </FormFieldLabel>

      <FFRadioGroup
        name={WAY_TO_MAKE_CALL}
        options={callMethodsMerged}
        keepErrorIndent={false}
        ItemComponent={WayToMakeCallItem}
      />
    </div>
  );
};

export default WaysToMakeCalls;
