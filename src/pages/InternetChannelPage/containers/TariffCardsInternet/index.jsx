import React, { useContext } from 'react';
import { useFormState } from 'react-final-form';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { ORDER_CHOSEN_TARIFF } from 'store/NewCampaign/channels/constants';
import GlobalIcon from 'components/common/GlobalIcon';

import { StoresContext } from 'store/mobx';
import TotalInfoInternet from '../TotalInfoInternet';
import { CardsWrapper } from '../../components/TariffCards';
import FFTariffCards from '../FFTariffCards';
import { useSelectedMediaplanData } from '../../hooks/use-selected-mediaplan-data';
import styles from './styles.pcss';

const TariffCardsInternet = () => {
  const { Templates } = useContext(StoresContext);
  const info = Templates.getNewCampaignTemplate('BriefOrderInternet').form_order;
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

export default observer(TariffCardsInternet);
