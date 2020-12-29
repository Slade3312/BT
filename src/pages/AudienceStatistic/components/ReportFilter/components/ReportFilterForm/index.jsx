import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { FinalForm } from 'components/forms';
import { StoresContext } from 'store/mobx';

const ReportFilterForm = (props) => {
  const { Audience } = useContext(StoresContext);
  return (
    <FinalForm
      onChange={values => Audience.set('values', values)}
      values={Audience.values}
      {...props}
    />
  );
};

export default observer(ReportFilterForm);
