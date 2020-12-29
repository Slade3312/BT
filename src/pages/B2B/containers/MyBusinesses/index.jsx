import React, { useContext } from 'react';
// import { ActionButton } from 'components/buttons';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { BeautyScrollbar } from 'components/common/index';
import { MY_BUSINESS_SCREEN } from 'store/mobx/Tinder';
import MyBusiness from '../MyBusiness';
import BusinessControls from './containers/BusinessControls';
import IncomingRequests from './containers/IncomingRequests';
import styles from './styles.pcss';


const MyBusinesses = () => {
  const { Tinder } = useContext(StoresContext);
  return (
    <BeautyScrollbar className={styles.scrollBar}>
      {
        Tinder.myBusinessActiveScreen === MY_BUSINESS_SCREEN.BUSINESSES_LIST &&
        <MyBusiness />
      }

      {
        Tinder.myBusinessActiveScreen === MY_BUSINESS_SCREEN.CONTROLS &&
        <BusinessControls />
      }

      {
        Tinder.myBusinessActiveScreen === MY_BUSINESS_SCREEN.INCOMING_REQUEST &&
        <IncomingRequests />
      }
    </BeautyScrollbar>
  );
};

/*
const EmptyBusiness = () => {
  return (
    <div className={styles.container}>
      <div className={styles.addNewText}>
        Добавьте свой бизнес, чтобы <br/>
        другие увидели вас на карте
      </div>
      <ActionButton iconSlug="arrowRightMinimal">
        Добавить бизнес
      </ActionButton>
    </div>
  );
};
*/
export default observer(MyBusinesses);
