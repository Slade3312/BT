import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import {
  BOOLEAN_TAXON_TRUE,
  TAXON_DEPENDENCY_PARENT_FIELD,
  TAXON_GROUP_NODE,
  TAXON_ITEM_NODE,
} from 'store/NewCampaign/taxonomy/constants';
import { throwNonBlockingError } from 'utils/errors';
import { convertListToObjectBy } from 'utils/fn';
import { getGroupedParentsTaxonNodes } from 'store/mobx/utils/taxons';

import CurrentTaxonSubgroup from '../CurrentTaxonSubgroup';
import { TaxonWidget } from '../index';

import styles from './styles.pcss';

function TaxonMapper({ taxonsGroupId }) {
  const { NewCampaign } = useContext(StoresContext);

  const parentsTaxonsList = NewCampaign.taxonsGroupParentsTaxonsList(taxonsGroupId);
  const parentsTaxonsData = convertListToObjectBy('id')(parentsTaxonsList);
  const groupedTaxonNodes = getGroupedParentsTaxonNodes(parentsTaxonsList);

  const childTaxons = (parentTaxonId) => NewCampaign.taxonsGroupChildTaxonsList(taxonsGroupId)
    .filter(item => item[TAXON_DEPENDENCY_PARENT_FIELD] === parentTaxonId);

  return (
    <>
      {groupedTaxonNodes.map((taxonNode) => {
        if (taxonNode.groupType === TAXON_GROUP_NODE) {
          return (
            <CurrentTaxonSubgroup groupNumberUid={taxonNode.subgroup}>
              {taxonNode.subgroupTaxonsIds.map(subgroupId => (
                <>
                  <TaxonWidget
                    type={parentsTaxonsData[subgroupId]?.type}
                    taxonUid={parentsTaxonsData[subgroupId]?.taxon_uid}
                    items={parentsTaxonsData[subgroupId]?.items}
                    tooltip={parentsTaxonsData[subgroupId]?.description}
                    title={parentsTaxonsData[subgroupId]?.name}
                    isExtOperatorBool = {parentsTaxonsData[subgroupId]?.external_operator}
                  />

                  {NewCampaign.currentCampaign.selection.data[parentsTaxonsData[subgroupId].taxon_uid] === BOOLEAN_TAXON_TRUE && (
                    <div className={styles.childTaxons}>
                      {childTaxons(parentsTaxonsData[subgroupId].id).map(insideChildTaxon => (
                        <TaxonWidget
                          type={insideChildTaxon?.type}
                          taxonUid={insideChildTaxon?.taxon_uid}
                          items={insideChildTaxon?.items}
                          tooltip={insideChildTaxon?.description}
                          title={insideChildTaxon?.name}
                          isExtOperatorBool = {insideChildTaxon?.external_operator}
                        />
                      ))}
                    </div>
                  )}
                </>
              ))}
            </CurrentTaxonSubgroup>
          );
        } else if (taxonNode.groupType === TAXON_ITEM_NODE) {
          return (
            <>
              <TaxonWidget
                type={taxonNode.type}
                taxonUid={taxonNode.taxon_uid}
                items={taxonNode.items}
                tooltip={taxonNode.description}
                title={taxonNode.name}
              />

              {NewCampaign.currentCampaign.selection.data[taxonNode.taxon_uid] === BOOLEAN_TAXON_TRUE && (
                <div className={styles.childTaxons}>
                  {childTaxons(taxonNode.id).map(childTaxon => (
                    <TaxonWidget
                      type={childTaxon?.type}
                      taxonUid={childTaxon?.taxon_uid}
                      items={childTaxon?.items}
                      tooltip={childTaxon?.description}
                      title={childTaxon?.name}
                      isExtOperatorBool = {childTaxon?.external_operator}
                    />
                  ))}
                </div>
              )}
            </>
          );
        }

        throwNonBlockingError('Unknown taxon node type in TaxonMapper');
        return 'Unknown taxon node';
      })}
    </>
  );
}

TaxonMapper.propTypes = {
  taxonsGroupId: PropTypes.string,
};

export default observer(TaxonMapper);
