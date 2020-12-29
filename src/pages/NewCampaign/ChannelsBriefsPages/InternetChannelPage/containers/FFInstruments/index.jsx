import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFieldArray } from 'react-final-form-arrays';
import { useSelector } from 'react-redux';
import { withError } from 'components/fields/TextInput/enhancers';
import withFieldArray from 'enhancers/withFieldArray';
import CustomPropTypes from 'utils/prop-types';
import { withForwardedRef } from 'enhancers';
import { getBriefOrderInternet, getBudgetEventsName } from 'store/common/templates/newCampaign/briefs-selectors';
import { getCampaignInternetOrderData, getToolsEvents } from 'store/NewCampaign/storage/selectors';
import { getEventsInfo } from 'pages/NewCampaign/utils';
import { Instrument } from '../../components';

function FFInstruments({ name, forwardedRef }) {
  const internetBriefTemplate = useSelector(getBriefOrderInternet);
  const orderData = useSelector(getCampaignInternetOrderData);

  const toolsEvents = getToolsEvents(orderData);
  const eventNames = getBudgetEventsName(internetBriefTemplate);

  const { fields } = useFieldArray(name);

  const preparedItems = useMemo(
    () =>
      (fields?.value || []).map(item => ({
        ...item,
        eventsInfo: getEventsInfo(toolsEvents[item.id] || {}, eventNames),
      })),
    [fields],
  );

  return (
    <div name={name} ref={forwardedRef}>
      {preparedItems.map(({ min, max, name: curLabel, id, eventsInfo, isActive }, index) => (
        <Instrument
          key={id}
          label={curLabel}
          min={min}
          max={max}
          name={`${name}.${index}`}
          info={eventsInfo}
          isDisabled={!isActive}
        />
      ))}
    </div>
  );
}

FFInstruments.propTypes = {
  name: PropTypes.string,
  forwardedRef: CustomPropTypes.ref,
};

export default withFieldArray(withError(withForwardedRef(FFInstruments)));
