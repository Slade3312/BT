import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { useFormState } from 'react-final-form';
import { StoresContext } from 'store/mobx';
import Heading from 'components/layouts/Heading';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';

import FieldLabel from '../../components/FieldLabel';
import FileInfo from './containers/FileInfo';

import styles from './styles.pcss';

function LoadFilesBlock() {
  const { errors } = useFormState();
  const { Social } = useContext(StoresContext);

  return (
    <div className={styles.container}>
      <Heading level={4}>Загрузите сканы документов</Heading>

      <ul className={styles.filesList}>
        {Social.filesFields.length ? Social.filesFields.map(item => (
          <li className={styles.filesRow}>
            <FieldLabel className={styles.filesLabel}>{item.name}</FieldLabel>

            <FileInfo
              files={item.files || []}
              fieldId={item?.id}
            />
          </li>
        )) : null}
      </ul>

      {Social.showErrors && errors[ADCREATINGFORM.INDUSTRY_DOCS] &&
        <span name={[ADCREATINGFORM.INDUSTRY_DOCS]} className={styles.error}>
          {errors[ADCREATINGFORM.INDUSTRY_DOCS]}
        </span>
      }
    </div>
  );
}

export default observer(LoadFilesBlock);
