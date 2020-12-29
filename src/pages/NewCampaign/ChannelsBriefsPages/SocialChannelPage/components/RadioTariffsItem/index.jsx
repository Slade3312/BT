import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatPriceWithLabel } from 'utils/formatting';
import { StoresContext } from 'store/mobx';
import { wordFormByCount } from 'utils/fn';
import styles from './styles.pcss';

export default function RadioAdvertisingContentItem({ name, budget, period, count }) {
  const { Templates } = useContext(StoresContext);

  const { chosenTariff } = Templates.getNewCampaignTemplate('BriefOrderTargetInternet')?.form_order || {};

  const duringAdvertisingForm = wordFormByCount(period, chosenTariff?.duringAdvertisingCases || []);

  return (
    <div className={styles.component}>
      <div className={classNames(styles.title)}>
        {name}
      </div>
      <div className={styles.valueInfo}>
        {formatPriceWithLabel(budget)}
      </div>

      <div className={styles.subTitle}>
        {chosenTariff?.duringAdvertisingInfo}
      </div>
      <div className={styles.valueInfo}>
        {period} {duringAdvertisingForm}
      </div>

      <div className={styles.subTitle}>
        {chosenTariff?.forecastEventsInfo}
      </div>
      <div className={styles.valueInfo}>
        <span className={styles.equalSymbol}>≈</span>{count}
      </div>
    </div>
  );
}

RadioAdvertisingContentItem.propTypes = {
  name: PropTypes.string,
  budget: PropTypes.string,
  period: PropTypes.string,
  count: PropTypes.string,
};
