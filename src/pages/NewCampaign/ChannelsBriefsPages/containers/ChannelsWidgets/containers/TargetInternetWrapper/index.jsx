import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';

const TargetInternetWrapper = ({ children }) => {
  const { UserInfo } = useContext(StoresContext);
  if (UserInfo?.data?.company?.self_employed) return <div className={styles.container}>{children}</div>;
  return children;
};

export default observer(TargetInternetWrapper);
