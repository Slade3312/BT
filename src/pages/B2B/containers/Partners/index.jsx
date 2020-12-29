import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { SCREEN } from 'store/mobx/Tinder';
import PartnersList from '../PartnersList';
import IndustryItems from '../IndustryItems';
// import Item from '../Item';

const Partners = () => {
  const { Tinder } = useContext(StoresContext);
  return (
    <>
      {
        Tinder.sidebarScreen === SCREEN.PARTNERSHIP &&
        <PartnersList />
      }

      {
        Tinder.sidebarScreen === SCREEN.INDUSTRY &&
        <IndustryItems />
      }
    </>
  );
};

export default observer(Partners);
