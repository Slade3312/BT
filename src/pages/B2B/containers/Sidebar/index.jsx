import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { SCREEN, MY_BUSINESS_SCREEN } from 'store/mobx/Tinder';
import FloatSidebar from '../FloatSidebar';
import MyBusinesses from '../MyBusinesses';
import Partners from '../Partners';
import Item from '../Item';
import IndustryItems from '../IndustryItems';
import styles from './styles.pcss';

const Sidebar = () => {
  const { Tinder } = useContext(StoresContext);
  return (
    <div className={styles.container}>
      {
        (Tinder.sidebarScreen === SCREEN.PARTNERSHIP ||
        (Tinder.sidebarScreen === SCREEN.BUSINESS &&
        Tinder.myBusinessActiveScreen === MY_BUSINESS_SCREEN.BUSINESSES_LIST)
        ) &&
        <div className={styles.sidebar}>
          <div className={styles.navPanel}>
            <div
              className={`${styles.navItem} ${Tinder.sidebarScreen === SCREEN.BUSINESS && styles.active}`}
              onClick={() => Tinder.set('sidebarScreen', SCREEN.BUSINESS)}>
              Ваш бизнес
            </div>
            <div
              className={`${styles.navItem} ${Tinder.sidebarScreen === SCREEN.PARTNERSHIP && styles.active}`}
              onClick={() => Tinder.set('sidebarScreen', SCREEN.PARTNERSHIP)}
            >
              Сотрудничество
            </div>
          </div>
          <div className={`${styles.navLine} ${styles[Tinder.sidebarScreen]}`} />
        </div>
      }

      {
        Tinder.sidebarScreen === SCREEN.BUSINESS &&
        <MyBusinesses />
      }

      {
        Tinder.sidebarScreen === SCREEN.PARTNERSHIP &&
        <Partners />
      }

      {
        Tinder.sidebarScreen === SCREEN.INDUSTRY &&
        <IndustryItems />
      }

      {
        Tinder.sidebarScreen === SCREEN.ITEM &&
        <Item />
      }
      <FloatSidebar />
    </div>
  );
};

export default observer(Sidebar);
