import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import ErrorBase from '../ErrorBase';
import styles from './styles.pcss';

const ErrorTooManyRequests = () => {
  const { Templates: { getPopupsTemplate } } = useContext(StoresContext);
  const { title, subtitle } = getPopupsTemplate('AudienceTooManyRequests');
  return (
    <ErrorBase level={2} title={title}>
      <div className={styles.description}>{subtitle}</div>
    </ErrorBase>
  );
};

export default observer(ErrorTooManyRequests);
