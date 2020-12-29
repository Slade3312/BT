import React, { createContext } from 'react';
import PropsTypes from 'prop-types';
import UserInfo from './UserInfo';
import Common from './Common';
import Templates from './Templates';
import Faq from './Faq';
import Audience from './Audience';
import CreateReport from './CreateReport';
import Polls from './Polls';
import Reports from './Reports';
import NewCampaign from './NewCampaign';
import Authorization from './Authorization';
import Chat from './Chat';
import Social from './Social';
import Tinder from './Tinder';
import TinderChat from './TinderChat';
import WebsAndPhonesTaxons from './WebsAndPhonesTaxons';
import MyCampaigns from './MyCampaigns';

const StoresContext = createContext();

const MobxStoreProvider = ({ children }) => (
  <StoresContext.Provider
    value={{
      UserInfo,
      Common,
      Templates,
      Faq,
      Audience,
      CreateReport,
      Polls,
      NewCampaign,
      WebsAndPhonesTaxons,
      Reports,
      Chat,
      Authorization,
      Social,
      TinderChat,
      Tinder,
      MyCampaigns,
    }}
  >
    {children}
  </StoresContext.Provider>
);

MobxStoreProvider.propTypes = {
  children: PropsTypes.node,
};

export { MobxStoreProvider, StoresContext };
