import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import Preloader from 'components/common/Preloader';

const LandingPage = () => {
  const { Tinder } = useContext(StoresContext);
  useEffect(() => {
    Tinder.getMyBusinesses();
  }, []);
  return (
    <>
      {
        Tinder.isInitialDataLoading &&
        <Preloader />
      }
    </>
  );
};

export default observer(LandingPage);
