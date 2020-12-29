import React from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { ORDER_CHOSEN_TARIFF } from 'store/NewCampaign/channels/constants';
import GlobalIcon from 'components/common/GlobalIcon';
import { getInternetBriefFormOrder } from 'store/common/templates/newCampaign/briefs-selectors';

import TotalInfoInternet from '../TotalInfoInternet';
import { CardsWrapper } from '../../components/TariffCards';
import FFTariffCards from '../FFTariffCards';
import { useSelectedMediaplanData } from '../../hooks/use-selected-mediaplan-data';
import styles from './styles.pcss';

const TariffCardsInternet = ({ info }) => {
  const {
    values: { isOverdueTariffs },
  } = useFormState();

  const curTariff = useSelectedMediaplanData();

  return (
    <>
      {!isOverdueTariffs ? (
        <div className={styles.notificationChoose}>{info.tariffChoose}</div>
      ) : (
        <div className={styles.notificationChange}>
          <GlobalIcon icon={info.tariffChangedIcon} className={styles.iconChanged} />
          {info.tariffChanged}
        </div>
      )}
      <CardsWrapper isDisabled={isOverdueTariffs}>
        <FFTariffCards className={classNames(styles.cards, !curTariff && styles.indent)} name={ORDER_CHOSEN_TARIFF} />
        {curTariff && <TotalInfoInternet />}
      </CardsWrapper>
    </>
  );
};

TariffCardsInternet.propTypes = {
  info: PropTypes.object,
};

export default connect(state => ({
  info: getInternetBriefFormOrder(state),
}))(TariffCardsInternet);
