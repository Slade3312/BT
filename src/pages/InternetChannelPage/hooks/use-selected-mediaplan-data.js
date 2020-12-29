import { useMemo } from 'react';
import { useFormState } from 'react-final-form';
import { ORDER_CHOSEN_TARIFF, ORDER_TARIFFS } from 'store/NewCampaign/channels/constants';

export const getSelectedMediaplansByChosenTariff = (chosenTariff, tariffs) => {
  const foundItem = (tariffs || []).find(({ id }) => chosenTariff === id);
  return foundItem
    ? {
      budget: foundItem.price,
      totalEvents: foundItem.clicks,
      averageCost: foundItem.cpc,
    }
    : null;
};

export const useSelectedMediaplanData = () => {
  const {
    values: { [ORDER_CHOSEN_TARIFF]: chosenTariff, [ORDER_TARIFFS]: tariffs },
  } = useFormState();
  return useMemo(() => getSelectedMediaplansByChosenTariff(chosenTariff, tariffs), [chosenTariff, tariffs]);
};
