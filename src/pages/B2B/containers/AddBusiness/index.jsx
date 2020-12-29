import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import AddAction from './containers/AddAction';
import LandingPage from './containers/LandingPage';
import Instructions from './containers/Instructions';
import { AddBusiness } from './containers/AddBusiness';

const Intro = () => {
  const { Tinder } = useContext(StoresContext);
  switch (Tinder.introStep) {
    case 0:
      return (<LandingPage />);
    case 1:
      return (<AddBusiness />);
    case 2:
      return (<AddAction />);
    case 3:
      return (<Instructions />);
    default:
      return <div/>;
  }
};

export default observer(Intro);
