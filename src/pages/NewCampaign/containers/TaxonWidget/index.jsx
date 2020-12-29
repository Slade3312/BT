import React from 'react';
import PropTypes from 'prop-types';
import { throwNonBlockingError } from 'utils/errors';
import { FFSelect, FFMultiSelect } from 'components/fields';
import {
  TAXON_TYPE_BOOLEAN, TAXON_TYPE_GEO, TAXON_TYPE_LOCATION, TAXON_TYPE_SUBGROUP,
  TAXON_TYPE_CATEGORY, TAXON_TYPE_MAP, TAXON_TYPE_ARRAY, DESCRIPTION_EXTERNAL_OPERATOR,
} from 'store/NewCampaign/taxonomy/constants';
import { getLocationLabelByProps } from 'store/mobx/utils/taxons';
import { convertListToObjectBy } from 'utils/fn';

import TaxonFormField from '../TaxonFormField';
import SwitchTaxon from '../../components/SwitchTaxon';

function TaxonWidget({ type, taxonUid, items, title, tooltip, isExtOperatorBool }) {
  const haveBooleanOptions = (items.length === 2) && (
    items.every((item) => item.value === 'Да' || item.value === 'Нет' || item.value === 'Есть')
  );

  const descriptionBoolForm = type === TAXON_TYPE_BOOLEAN && !isExtOperatorBool ? DESCRIPTION_EXTERNAL_OPERATOR : null;
  const isToggleView = haveBooleanOptions || (type === TAXON_TYPE_BOOLEAN && items.length === 1);

  let options = [];

  if (type === TAXON_TYPE_LOCATION) {
    const itemsByKey = convertListToObjectBy('key')(items);

    options = items.map(({ key, value, parent, alias_value }) => ({
      value: key,
      label: getLocationLabelByProps(itemsByKey, { value, parent, alias_value }),
    }));
  } else {
    options = items.map(({ key, value, external_operator }) => {
      return !external_operator ? { value: key, label: value, description: DESCRIPTION_EXTERNAL_OPERATOR } : { value: key, label: value };
    });
  }


  function renderTaxonField() {
    if (isToggleView) return <SwitchTaxon name={taxonUid} />;

    switch (type) {
      case TAXON_TYPE_BOOLEAN:
        return (
          <FFSelect
            options={[{ value: null, label: 'Не важно' }, ...options]}
            name={taxonUid}
          />
        );
      case TAXON_TYPE_CATEGORY:
      case TAXON_TYPE_MAP:
      case TAXON_TYPE_ARRAY:
      case TAXON_TYPE_SUBGROUP:
        return (
          <FFMultiSelect
            options={options}
            name={taxonUid}
          />
        );
      default:
        throwNonBlockingError(`Unknown taxon type ${type} found`);
        return (
          <React.Fragment>
            {JSON.stringify({ type, name, options })}
          </React.Fragment>
        );
    }
  }

  return (
    <React.Fragment>
      {type !== TAXON_TYPE_GEO && type !== TAXON_TYPE_LOCATION && (
        <TaxonFormField
          label={title}
          tooltip={tooltip}
          isInline={isToggleView}
          isSecondary
          description = {descriptionBoolForm}
        >
          {renderTaxonField()}
        </TaxonFormField>
      )}
    </React.Fragment>
  );
}

TaxonWidget.propTypes = {
  type: PropTypes.string,
  taxonUid: PropTypes.string,
  title: PropTypes.string,
  tooltip: PropTypes.string,
  items: PropTypes.array,
  isExtOperatorBool: PropTypes.bool,
};

export default TaxonWidget;
