import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import debounce from 'debounce';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { FinalForm } from 'components/forms';
import { StoresContext } from 'store/mobx';
import { GEO_TYPE_ACTION } from 'store/NewCampaign/channels/constants';

import { modifyGeoPoints } from '../../utils';
import { geoActionOptions } from '../../../../constants';

function TaxonomyStepForm({ children }) {
  const { NewCampaign } = useContext(StoresContext);

  const handleFormChange = debounce((newValues) => {
    const modifiedNewValues = newValues.geo_points ? modifyGeoPoints(newValues) : newValues;

    NewCampaign.currentCampaign.selection.data = modifiedNewValues;

    NewCampaign.updateSelection();
  }, 300);

  return (
    <FinalForm
      values={
        Object.keys(toJS(NewCampaign.currentCampaign?.selection?.data || {})).includes(GEO_TYPE_ACTION)
          ? toJS(NewCampaign.currentCampaign.selection.data)
          : toJS({ ...NewCampaign.currentCampaign.selection.data, GEO_TYPE_ACTION: geoActionOptions[0].value })
      }
      onChange={handleFormChange}
    >
      {children}
    </FinalForm>
  );
}

TaxonomyStepForm.propTypes = {
  children: PropTypes.node,
};

export default observer(TaxonomyStepForm);
