import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { FFSelect } from 'components/fields';
import { TextViewer } from 'components/fields/TextInput';

const FFSwitchLabeledSelectConnected = (props) => {
  const { UserInfo, Common } = useContext(StoresContext);
  return (
    UserInfo.isEditable &&
    <FFSelect
      {...props}
      options={Common.industries.slice()}
      value={UserInfo.selectedIndustryLabel}
    /> ||
    <TextViewer value={UserInfo.selectedIndustryLabel} />
  );
};

export default observer(FFSwitchLabeledSelectConnected);
