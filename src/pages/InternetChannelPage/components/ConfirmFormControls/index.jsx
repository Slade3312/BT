import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';
import { ORDER_CHOSEN_TARIFF } from 'store/NewCampaign/channels/constants';
import ButtonMediaplans from '../ButtonMediaplans';
import ValidationInformer from '../../containers/ValidationInformer';
import { useNormalizedInternetFields } from '../../hooks/use-normalized-internet-fields';
import styles from './styles.pcss';

export default function ConfirmFormControls({ isTariffsLoading, setTariffsLoading }) {
  const {
    errors: { [ORDER_CHOSEN_TARIFF]: _, ...otherErrors },
  } = useFormState();

  const formTemplateData = useNormalizedInternetFields();

  const fieldsLabelsByName = useMemo(() => {
    const result = {};
    Object.keys(formTemplateData).forEach((key) => {
      result[key] = formTemplateData[key]?.label?.toLowerCase();
    });
    return result;
  }, [formTemplateData]);

  return (
    <div className={styles.component}>
      <ButtonMediaplans isLoading={isTariffsLoading} onSetLoading={setTariffsLoading} />
      <ValidationInformer className={styles.rightRow} fieldsLabelsByName={fieldsLabelsByName} errors={otherErrors} />
    </div>
  );
}

ConfirmFormControls.propTypes = {
  isTariffsLoading: PropTypes.bool,
  setTariffsLoading: PropTypes.func,
};
