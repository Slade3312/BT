import React, { useContext, useMemo } from 'react';
import { useFormState } from 'react-final-form';
import { observer } from 'mobx-react';
import { Status } from 'components/common';
import { formatPrice } from 'utils/formatting';
import { getTotalBudgetBySelectedTools } from 'store/NewCampaign/storage/selectors';
import { RightArrowLabel } from 'components/layouts';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { StoresContext } from 'store/mobx';
import FieldLabel from '../../InternetChannelPage/components/FieldLabel';
import { useInternetValidToCalculate } from '../../InternetChannelPage/hooks/use-internet-valid-to-calculate.js';
import styles from './styles.pcss';

const BudgetTotalField = () => {
  const { NewCampaign } = useContext(StoresContext);
  const {
    values: { tools },
  } = useFormState();
  const minBudget = formatPrice(NewCampaign.currentCampaign.currentOrder.minimalBudget);

  const isValidToCalculate = useInternetValidToCalculate();
  const { total_events = {} } = NewCampaign.calculate;
  const { qty_max = 0, qty_min = 0 } = total_events;

  const totalBudget = getTotalBudgetBySelectedTools(tools);

  const getEventsMessage = () => qty_min && qty_max && `от ${qty_min} до ${qty_max} переходов`;

  const renderWithBudgetInfo = () => (
    <>
      <span className={styles.value}>{totalBudget} ₽</span>
      <RightArrowLabel>
        {isValidToCalculate ? (
          getEventsMessage()
        ) : (
          <Status className={styles.status}>
            Общий бюджет на интернет-рекламу должен быть не менее {minBudget} рублей
          </Status>
        )}
      </RightArrowLabel>
    </>
  );

  const renderRequiredMessage = () => (
    <Status className={styles.status}>Выберите необходимые инструменты выше, и укажите для них бюджет</Status>
  );

  return (
    <div className={styles.fieldRow}>
      <FieldLabel text="Итоговый бюджет" />

      <div className={styles.component}>
        {totalBudget > 0 ? (
          renderWithBudgetInfo()
        ) : (
          renderRequiredMessage()
        )}
      </div>
    </div>
  );
};

export default observer(BudgetTotalField);
