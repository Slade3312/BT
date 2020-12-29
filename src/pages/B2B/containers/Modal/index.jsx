import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Skeleton from 'react-loading-skeleton';
import { BeautyScrollbar } from 'components/common';
import { StoresContext } from 'store/mobx';
import GlobalIcon from 'components/common/GlobalIcon';
import IconChooser from 'components/common/IconChooser';
import ChooseYourAction from '../ChooseYourAction';
import styles from './styles.pcss';

const Modal = () => {
  const { Tinder } = useContext(StoresContext);
  return (
    <div className={styles.container}>
      <BeautyScrollbar className={styles.content}>
        <button className={styles.cross} onClick={() => Tinder.closeModalPartners()}>
          <GlobalIcon slug="crossThin" />
        </button>
        {
          Tinder.partnersRequest &&
          <Loading />
        }

        {
          Tinder.partnersRequestFailed === true &&
          <Fail />
        }

        {
          Tinder.partnersRequestFailed === false &&
          <Success />
        }

        {
          Tinder.partnersRequestFailed !== false &&
          Tinder.partnersRequestFailed !== true &&
          !Tinder.partnersRequest &&
          <ChooseYourAction />
        }
      </BeautyScrollbar>
    </div>
  );
};


const Success = () => {
  return (
    <div className={styles.responseContainer}>
      <div className={styles.handshake}>
        <GlobalIcon slug="handshakeWhiteLarge" />
      </div>
      <div className={styles.text}>
        Предложение было<br/> успешно отправлено
      </div>
    </div>
  );
};

const Fail = () => {
  return (
    <div className={styles.responseContainer}>
      <div className={styles.failFace}>
        <IconChooser type={IconChooser.propConstants.types.fail} />
      </div>
      <div className={styles.text}>
        Упс... что-то пошло не так.<br/>Попробуйте повторить действие<br/> через пару минут
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.responseContainer}>
      <div className={styles.failFace}>
        <Skeleton width={100} height={100} circle />
      </div>
      <div className={styles.text}>
        <Skeleton height={17} width={150} />
        <Skeleton height={17} width={200} />
      </div>
    </div>
  );
};

export default observer(Modal);
