import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';
import { useSelector } from 'react-redux';
import { FormFieldLabel } from 'components/forms';
import { FFRadioGroup } from 'components/fields';
import { ORDER_CONNECTION_TYPE, ACTIVITY_FIELD } from 'store/NewCampaign/channels/constants';
import WaysToMakeCalls from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/components/WaysToMakeCalls/WaysToMakeCalls';
import { withFinalField } from 'enhancers';
import { getBriefOrderVoice } from 'store/common/templates/newCampaign/briefs-selectors';
import ConnectionTypeItem from '../ConnectionTypeItem/ConnectionTypeItem';
import CoastPerActionBlock from '../CoastPerActionBlock/CoastPerActionBlock';
import styles from './styles.pcss';

const FFCoastPerActionBlock = withFinalField(CoastPerActionBlock);

const chooseComponent = (id = 1) => {
  switch (id) {
    case 1:
      return <WaysToMakeCalls />;
    case 2:
      return <FFCoastPerActionBlock name={ACTIVITY_FIELD} />;
    default:
      return null;
  }
};

const ConnectionTypeBlock = ({ connectionTypes }) => {
  const { values } = useFormState();
  const { [ORDER_CONNECTION_TYPE]: connectionType } = values;
  const { connectionTypeBlock: { title, linkLabel, url, data } } = useSelector(getBriefOrderVoice);

  // Merge backend data with templates and utils data
  const connectionTypesMerged = useMemo(() => {
    return connectionTypes.map((item, i) => {
      return {
        ...item,
        ...data[i],
      };
    });
  }, [connectionTypes]);

  return (
    <div>
      <div className={styles.titleBlock}>
        <FormFieldLabel isBold>
          {title}
        </FormFieldLabel>

        <a className={styles.tariffLink} href={url} target="_blank" rel="noopener noreferrer">
          {linkLabel}
        </a>
      </div>

      <FFRadioGroup
        name={ORDER_CONNECTION_TYPE}
        options={connectionTypesMerged}
        keepErrorIndent={false}
        ItemComponent={ConnectionTypeItem}
      />

      {chooseComponent(connectionType)}
    </div>
  );
};

ConnectionTypeBlock.propTypes = {
  connectionTypes: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.number,
  })),
};

export default ConnectionTypeBlock;
