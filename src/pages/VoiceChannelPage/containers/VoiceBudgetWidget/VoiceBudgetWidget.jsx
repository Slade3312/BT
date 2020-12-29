import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { useFormState } from 'react-final-form';
import commonStyles from 'styles/common.pcss';

import { ORDER_CONNECTION_TYPE } from 'store/NewCampaign/channels/constants';
import { FormFieldLabel } from 'components/forms';

import { StoresContext } from 'store/mobx';
import SelfCallBudget from '../../components/SelfCallBudget/SelfCallBudget';
import CallCenterBudget from '../../components/CallCenterBudget/CallCenterBudget';
import IndividualBudget from '../../components/IndividualBudget/IndividualBudget';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });


const chooseComponent = (id = 1) => {
  switch (id) {
    case 1:
      return <SelfCallBudget />;
    case 2:
      return <CallCenterBudget />;
    case 3:
      return <IndividualBudget />;
    default:
      return null;
  }
};

function VoiceBudgetWidget({ channelType, className }) {
  const { Templates } = useContext(StoresContext);
  const orderTemplateForm = Templates.getNewCampaignTemplate('BriefOrderSms').form_order;
  const budgetField = orderTemplateForm.budget;

  const { values } = useFormState();
  const { [ORDER_CONNECTION_TYPE]: connectionType } = values;

  const label = budgetField?.label;
  const tooltip = budgetField?.tooltip;

  return (
    <div className={cx('container', className)}>
      <FormFieldLabel isBold tooltip={tooltip} className={cx('marb-xxxs')}>
        {label}
      </FormFieldLabel>

      {chooseComponent(connectionType)}
    </div>
  );
}

VoiceBudgetWidget.propTypes = {
  channelType: PropTypes.string,
  className: PropTypes.string,
};

export default observer(VoiceBudgetWidget);
