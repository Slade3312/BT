import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FormFieldLabel } from 'components/forms';
import { FFRadioGroup } from 'components/fields';
import { WAY_TO_MAKE_CALL } from 'store/NewCampaign/channels/constants';
import { getChannelsData } from 'store/MyCampaigns/selectors';
import { getBriefOrderVoice } from 'store/common/templates/newCampaign/briefs-selectors';
import WayToMakeCallItem from '../WayToMakeCallItem/WayToMakeCallItem';

import styles from './styles.pcss';

const WaysToMakeCalls = () => {
  const { callMethods } = useSelector(getChannelsData);
  const { waysToMakeCalls: { title, data } } = useSelector(getBriefOrderVoice);

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
