import React from 'react';
import { FFSwitch } from 'components/fields';
import { BOOLEAN_TAXON_TRUE } from 'store/NewCampaign/taxonomy/constants';


export default function SwitchTaxon(props) {
  return (
    <FFSwitch
      {...props}
      onChangeProxy={val => val && BOOLEAN_TAXON_TRUE || null}
      valueProxy={val => val === BOOLEAN_TAXON_TRUE}
    />
  );
}

SwitchTaxon.propTypes = {
  ...FFSwitch.propTypes,
};
