import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { CompletedStep, Row } from 'components/common/CompletedStep';
import Heading from 'components/layouts/Heading';
import { LightText } from 'components/common';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import FileIcon from 'components/common/FileIcon';

import styles from './styles.pcss';

const СompanyInfoCompleted = observer(({ onChange }) => {
  const { Social } = useContext(StoresContext);
  return (
    <CompletedStep onChange={onChange}>
      <Row>{Social.adStep[ADCREATINGFORM.CLIENT_INFO]}</Row>

      <Row>{Social.activeCompanyIndustryName}</Row>

      {Social.adStep[ADCREATINGFORM.INDUSTRY_DOCS].map(item => (
        <Row className={styles.fileCompletedRow}>
          <FileIcon
            isSvgIcon
            className={styles.fileIcon}
            extension={`${item.file_extension}Round`}
            alt={`Скан ${item?.file_name}`}
          />

          <Heading level={5}>{item.file_name}</Heading>

          <LightText className={styles.fileSize}>
            ({`${item.file_extension}, ${item.file_size}`})
          </LightText>
        </Row>
      ))}

    </CompletedStep>
  );
});

export default СompanyInfoCompleted;
