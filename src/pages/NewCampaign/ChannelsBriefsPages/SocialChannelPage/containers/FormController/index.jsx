import { useEffect, useMemo } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { observer } from 'mobx-react';
import Social from 'store/mobx/Social';
import NewCampaign from 'store/mobx/NewCampaign';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import {
  stepChosenTariffsFieldsIndicators,
  stepCompanyInfoIndicators,
  stepAdCreatingIndicators,
} from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/constants';
import { useFieldChangeDetector } from 'hooks/use-fields-change-detector';
import { setPromocodeOverdue } from 'store/NewCampaign/campaign/actions';
import { getCampaignPromocodeData } from 'store/NewCampaign/campaign/selectors';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';

function FormController({ children }) {
  const formApi = useForm();
  const dispatch = useDispatch();
  const { values, errors } = useFormState();

  const promocodeData = useSelector(getCampaignPromocodeData)[CHANNEL_STUB_TARGET_INTERNET] || {};

  const isStepChosenTariffsValid = useMemo(() => {
    return Object.keys(stepChosenTariffsFieldsIndicators).every(fieldName => !errors[fieldName]);
  }, [errors]);

  const isStepСompanyInfoValid = useMemo(() => {
    if (Social.activeCompanyIndustry.industry_docs?.length) {
      stepCompanyInfoIndicators[ADCREATINGFORM.INDUSTRY_DOCS] = true;
    }

    return Object.keys(stepCompanyInfoIndicators, 2).every(fieldName => !errors[fieldName]);
  }, [errors]);

  const isStepAdCreatingValid = useMemo(() => {
    return Object.keys(stepAdCreatingIndicators).every(fieldName => !errors[fieldName]);
  }, [errors]);

  useEffect(() => {
    const loadTariffs = async () => {
      const tariffs = await Social.fetchTariffs();

      const actualTariffId = tariffs.find(({ id }) => id === values[ADCREATINGFORM.CHOSEN_TARIFF]);
      if (tariffs?.length && !actualTariffId) {
        formApi.change(ADCREATINGFORM.CHOSEN_TARIFF, tariffs[0].id);
      }

      const campaignId = Number(window.location.pathname.split('/')[2]);
      if (!campaignId) return;

      Social.tariffs.forEach(tariff => {
        NewCampaign.loadCalculateTariff(tariff, campaignId);
      });
    };

    loadTariffs();
  }, []);

  useFieldChangeDetector(() => {
    dispatch(setPromocodeOverdue(promocodeData));
  });

  return children({ isStepChosenTariffsValid, isStepСompanyInfoValid, isStepAdCreatingValid });
}

export default observer(FormController);
