import React, { useContext, useRef } from 'react';
import { useFormState } from 'react-final-form';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Heading from 'components/layouts/Heading';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import { FFTextArea, FFSelect } from 'components/fields';
import Tooltip from 'components/common/Tooltip';
import { StoresContext } from 'store/mobx';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import { ActionButton } from 'components/buttons';
import {
  stepCompanyInfoIndicators,
} from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/constants';

import FieldLabel from '../../components/FieldLabel';
import LoadFilesBlock from '../LoadFilesBlock';
import styles from './styles.pcss';

const MAX_CLIENT_INFO_LENGTH = 115;

function СompanyInfo({ setNextStep }) {
  const { Social, Templates } = useContext(StoresContext);
  const { companyInfoStep } = Templates.getNewCampaignTemplate('BriefOrderTargetInternet');

  const { errors } = useFormState();
  const submitBtn = useRef();

  const onScrollToInvalid = useScrollToInvalid(submitBtn.current);

  const checkFormForErrors = () => {
    if (Social.activeCompanyIndustry?.industry_docs?.length) {
      stepCompanyInfoIndicators[ADCREATINGFORM.INDUSTRY_DOCS] = true;
    }

    const checkStepForErrors = (stepFields) => {
      return Object.keys(stepFields).some((fieldName) => {
        return errors[fieldName];
      });
    };
    if (checkStepForErrors(stepCompanyInfoIndicators, 2)) {
      Social.set('showErrors', true);
      submitBtn.current.click();
      onScrollToInvalid();
      return;
    }
    setNextStep();
  };

  return (
    <>
      <Heading level={3} className={styles.heading}>{companyInfoStep.title}</Heading>

      <div className={styles.formRow}>
        <FieldLabel>{companyInfoStep.clientInfoLabel}</FieldLabel>

        <FFTextArea
          autoTrim={false}
          name={ADCREATINGFORM.CLIENT_INFO}
          value={Social.adStep[ADCREATINGFORM.CLIENT_INFO]}
          className={styles.textarea}
          maxLength="115"
        />

        <Tooltip className={styles.tooltip}>{companyInfoStep.clientInfoTooltip}</Tooltip>

        <span className={styles.textCounter}>
          {MAX_CLIENT_INFO_LENGTH - Social.adStep[ADCREATINGFORM.CLIENT_INFO].length || 0}
        </span>
      </div>

      <div className={styles.formRow}>
        <FieldLabel>{companyInfoStep.industryLabel}</FieldLabel>

        <FFSelect
          options={Social.industriesOptions}
          name={ADCREATINGFORM.INDUSTRY}
          keepErrorIndent={false}
          className={styles.select}
        />
      </div>

      {!!Social.activeCompanyIndustry.id
        && Social.activeCompanyIndustry?.industry_docs?.length !== 0
        && <LoadFilesBlock />
      }

      <div className={styles.btnContainer}>
        <button type="submit" className={styles.hidden} ref={submitBtn}/>
        <ActionButton
          onClick={checkFormForErrors}
          type="button"
          className={styles.nextButton}
          iconSlug="arrowRightMinimal"
        >
          {companyInfoStep.nextButtonText}
        </ActionButton>
      </div>
    </>
  );
}

СompanyInfo.propTypes = {
  setNextStep: PropTypes.func,
};


export default observer(СompanyInfo);
