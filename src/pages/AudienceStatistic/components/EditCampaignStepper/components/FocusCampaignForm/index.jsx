import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { FinalForm } from 'components/forms';
import { StoresContext } from 'store/mobx';

const FocusCampaignForm = ({ children, className }) => {
  const { CreateReport: { set, values } } = useContext(StoresContext);
  return (
    <FinalForm
      className={className}
      values={values}
      onChange={value => set('values', value)}
    >
      {children}
    </FinalForm>
  );
};

FocusCampaignForm.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default observer(FocusCampaignForm);
