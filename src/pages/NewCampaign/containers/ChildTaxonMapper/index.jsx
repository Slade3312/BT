import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import * as Taxon from 'store/NewCampaign/taxonomy/taxons/selectors';
import { TaxonContext } from 'store/NewCampaign/taxonomy/context';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


function ChildTaxonMapper({ taxonIds, isParentTaxonChecked, children }) {
  return isParentTaxonChecked && (
    <div className={cx('component')}>
      {taxonIds.map(taxonId => (
        <TaxonContext.Provider value={taxonId} key={taxonId}>
          {children}
        </TaxonContext.Provider>
      ))}
    </div>
  );
}

ChildTaxonMapper.propTypes = {
  taxonIds: PropTypes.arrayOf(PropTypes.any),
  isParentTaxonChecked: PropTypes.bool,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  taxonIds: Taxon.getChildTaxonIds(state),
  isParentTaxonChecked: Taxon.getIsChecked(state),
});

export default Taxon.connect(mapStateToProps)(ChildTaxonMapper);
