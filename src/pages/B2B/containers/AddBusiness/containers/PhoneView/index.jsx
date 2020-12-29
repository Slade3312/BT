import React from 'react';
import styles from './styles.pcss';
import phone_border from './assets/phone_border.png';
import head from './assets/head.png';

const PhoneView = () => {
  return (
    <div className={styles.phoneHolder}>
      <div
        className={styles.screenHolder}
        style={{
            background: `url(${phone_border}), url(${head})`,
            backgroundSize: 'contain',
        }}
    >
        <div className={styles.titlesHolder}>MATADOR</div>
      </div>
    </div>
  );
};

export default PhoneView;
