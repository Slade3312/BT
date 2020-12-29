import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import TinderLanding from 'pages/TinderLanding';
import Intro from './containers/Intro';
import Map from './containers/Map';


const TinderIntro = () => {
  const { Tinder } = useContext(StoresContext);
  if (!Tinder.isLandingShowed && !Tinder.isIntroFinished) return <TinderLanding />;
  return (
    <>
      {
        Tinder.isIntroFinished &&
        <Map /> ||
        <Intro />
      }
    </>
  );
};

export default observer(TinderIntro);
