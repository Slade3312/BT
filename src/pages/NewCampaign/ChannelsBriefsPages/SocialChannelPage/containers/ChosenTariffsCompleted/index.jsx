import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';
import { CompletedStep, Row } from 'components/common/CompletedStep';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';

function ChosenTariffsCompleted({ onChange }) {
  const { Social, Templates } = useContext(StoresContext);

  const formTemplate =
    Templates.getNewCampaignTemplate('BriefOrderTargetInternet').form_order ||
    {};

  const { autoStartInstant, autoStartConcreteDate, date } = formTemplate;

  const dateStart = Social.adStep[ADCREATINGFORM.DATE][0];

  return (
    <CompletedStep onChange={onChange}>
      <Row>
        {Social.adStep[ADCREATINGFORM.AUTO_START]
          ? autoStartInstant.label
          : autoStartConcreteDate.label}
      </Row>
      {dateStart && !Social.adStep[ADCREATINGFORM.AUTO_START] && (
        <Row>{`${date.label} ${Social.adStep[ADCREATINGFORM.DATE][0]}`}</Row>
      )}
      {Social.getSelectedTariff && <Row>{Social.getSelectedTariff?.name}</Row>}
    </CompletedStep>
  );
}

ChosenTariffsCompleted.propTypes = {
  onChange: PropTypes.func,
};

export default observer(ChosenTariffsCompleted);
