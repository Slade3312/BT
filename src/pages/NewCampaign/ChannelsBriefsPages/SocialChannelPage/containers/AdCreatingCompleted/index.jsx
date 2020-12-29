import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { CompletedStep, Row } from 'components/common/CompletedStep';
import styles from './styles.pcss';

const AdCreatingCompleted = observer(({ onChange }) => {
  const { Social } = useContext(StoresContext);
  return (
    <CompletedStep onChange={onChange}>
      <Row>{Social.adStep.title}</Row>
      <Row>{Social.adStep.description}</Row>
      <Row>
        {Social.getLogo && <img src={Social.getLogo.file_path} alt="" className={styles.logo}/>}
        {Social.getPostImg && <img src={Social.getPostImg.file_path} alt="" className={styles.main}/>}
      </Row>
      <Row>
        {Social.getButtonText}
      </Row>
      <Row>
        {Social.adStep.webSite}
      </Row>
      <Row>
        {
          Social.adStep.mobile && !Social.adStep.desktop &&
          'Показ только на мобильных устройствах'
        }
        {
          !Social.adStep.mobile && Social.adStep.desktop &&
          'Показ только на десктопах'
        }
        {
          Social.adStep.mobile && Social.adStep.desktop &&
          'Показ на мобильных устройствах и десктопах'
        }

      </Row>
    </CompletedStep>
  );
});

export default AdCreatingCompleted;
