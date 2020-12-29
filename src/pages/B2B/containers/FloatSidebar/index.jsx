import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import Item from '../Item';
import styles from './styles.pcss';


const FloatSidebar = () => {
  const { Tinder } = useContext(StoresContext);
  return (
    <div className={`${styles.floatSidebar} ${Tinder.isFloatSidebarOpened ? styles.opened : styles.closed}`}>
      {
        Tinder.isFloatSidebarOpened &&
        <Item onBack={Tinder.hideFloatSidebar} />
      }
    </div>
  );
};

export default observer(FloatSidebar);
