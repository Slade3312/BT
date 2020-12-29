import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import { GEO_TYPES } from 'constants/index';
import { convertListToObjectBy } from 'utils/fn';
import { GEO_TYPE_ACTION } from 'store/NewCampaign/channels/constants';

import FFMultiTabSelect from '../FFMultiTabSelect';
import FFRegionSuggestTextInput from '../FFRegionSuggestTextInput';
import GeoTaxonsBlock from '../GeoTaxonsBlock';
import TaxonFormLabel from '../../components/TaxonFormLabel';

import styles from './styles.pcss';

const cx = classNames.bind(commonStyles);

function GeoTaxonWidget() {
  const { Templates: { getNewCampaignTemplate }, NewCampaign } = useContext(StoresContext);
  const mapAdvice = getNewCampaignTemplate('StepAudienceContent')?.mapAdvice;

  const currentAction = NewCampaign.currentCampaign.selection?.data?.geoAction;

  const itemsDataById = convertListToObjectBy('key')(NewCampaign.geoAnyLocationTaxon?.items || []);

  const getLocationLabelByProps = (itemsMap, { value, parent, alias_value }) => {
    if (parent && itemsMap[parent]) {
      return `${itemsMap[parent].value}, ${value}`;
    }
    if (alias_value) {
      return alias_value;
    }
    return value;
  };

  const suggestOptions = NewCampaign.geoAnyLocationTaxon?.items.map(
    ({ key, value, parent, alias_value }) => ({
      value: key,
      label: getLocationLabelByProps(itemsDataById, { value, parent, alias_value }),
    }),
  );

  return (
    <React.Fragment>
      {currentAction === GEO_TYPES.REGIONS && (
        <div className={styles.inputsContainer}>
          <TaxonFormLabel
            text={NewCampaign.geoAnyLocationTaxon?.name}
            tooltip={NewCampaign.geoAnyLocationTaxon?.description}
            className={styles.textInputLabel}
          />

          <FFRegionSuggestTextInput
            options={suggestOptions}
            name={NewCampaign.geoAnyLocationTaxon?.taxon_uid}
          />

          <FFMultiTabSelect
            label="Выбрано"
            options={suggestOptions}
            name={NewCampaign.geoAnyLocationTaxon?.taxon_uid}
            className={cx('marb-s', 'mart-xs')}
          />
        </div>
      )}

      {currentAction === GEO_TYPES.POINTS && (
        <GeoTaxonsBlock
          name="geo_points"
          mapAdvice={mapAdvice}
        />
      )}
    </React.Fragment>
  );
}

export default observer(GeoTaxonWidget);
