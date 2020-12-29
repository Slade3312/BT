import { useFormState } from 'react-final-form';
import {
  stepAdCreatingIndicators,
  stepChosenTariffsFieldsIndicators,
  stepCompanyInfoIndicators,
} from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/constants';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import Social from 'store/mobx/Social';


export function useSubmitWithStepperValidation({ onSubmit, onSetErrorStep }) {
  const { errors } = useFormState();

  if (Social.activeCompanyIndustry?.industry_docs?.length) {
    stepCompanyInfoIndicators[ADCREATINGFORM.INDUSTRY_DOCS] = true;
  }

  const checkAndSetStepForErrors = (stepFields, stepId) => {
    return Object.keys(stepFields).some((fieldName) => {
      if (errors[fieldName]) {
        onSetErrorStep(stepId);
        Social.set('showErrors', true);
        return true;
      }
      return false;
    });
  };

  const handleOrderSubmit = () => {
    [
      () => checkAndSetStepForErrors(stepAdCreatingIndicators, 1),
      () => checkAndSetStepForErrors(stepCompanyInfoIndicators, 2),
      () => checkAndSetStepForErrors(stepChosenTariffsFieldsIndicators, 3),
    ].some((fn) => fn());

    // to correct render touched errors on rendered form node of selected step
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onSubmit();
      });
    });
  };

  return handleOrderSubmit;
}
