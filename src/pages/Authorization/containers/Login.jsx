import React from 'react';
import { observer } from 'mobx-react';
import Authorization from 'store/mobx/Authorization';
import { BeelineLogo } from '../assets';
import Sms from './Sms';
import Phone from './Phone';
import styles from './styles.pcss';


const Login = observer(() => {
  const { screen } = Authorization;
  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <BeelineLogo />
      </div>

      <div className={`${styles.form} ${styles[`${screen}Screen`]}`}>

        {
          screen === 'phone' &&
          <Phone /> ||
          screen === 'sms' &&
          <Sms />
          }
      </div>

    </div>
  );
});

export default Login;
