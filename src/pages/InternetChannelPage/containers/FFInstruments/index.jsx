import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withError } from 'components/fields/TextInput/enhancers';
import withFieldArray from 'enhancers/withFieldArray';
import CustomPropTypes from 'utils/prop-types';
import { withForwardedRef } from 'enhancers';
import { getEventsInfo } from 'pages/NewCampaign/utils';
import { StoresContext } from 'store/mobx';
import { Instrument } from '../../components';

function FFInstruments({ name, forwardedRef }) {
  const { NewCampaign, Templates } = useContext(StoresContext);

  const { calculate = {} } = NewCampaign;
  const { tools_events = {} } = calculate;
  const { eventsNamesByCount: eventNames } = Templates.getNewCampaignTemplate('BriefOrderInternet');
  const { tools } = NewCampaign.currentCampaign.currentOrder;

  const preparedItems = tools.map(item => ({
    ...item,
    eventsInfo: getEventsInfo(tools_events[item.id] || {}, eventNames),
  }));

  return (
    <div name={name} ref={forwardedRef}>
      {preparedItems.map(({ min, max, name: curLabel, id, eventsInfo, isActive }, index) => {
        return (
          <Instrument
            key={id}
            label={curLabel}
            min={min}
            max={max}
            name={`${name}.${index}`}
            info={eventsInfo}
            isDisabled={!isActive}
          />
        );
      })
      }
    </div>
  );
}

FFInstruments.propTypes = {
  name: PropTypes.string,
  forwardedRef: CustomPropTypes.ref,
};

export default withFieldArray(withError(withForwardedRef(observer(FFInstruments))));
