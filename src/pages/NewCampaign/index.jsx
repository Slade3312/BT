import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { navigate, Redirect, Router, useLocation } from '@reach/router';
import { OverlayLoader, PageLoader } from 'components/common/Loaders';
import { getCampaignRequest } from 'requests/campaigns';
import { axiosAuthorizedRequest } from 'requests/helpers';
import { extractError } from 'utils/errors';
import { StoresContext } from 'store/mobx';
import { usePrevious } from 'hooks/use-previous';
import NameStepPage from 'pages/NameStepPage';
import { scrollSmoothTo } from 'utils/scroll.js';
import {
  dtoToViewSmsChannelData,
  dtoToViewDraftData,
  dtoToViewVoiceChannelData,
  dtoToViewPushChannelData,
  dtoToViewInternetChannelData,
} from 'store/NewCampaign/campaign/utils';
import ChooseChannels from 'pages/ChooseChannels';
import SmsChannelPage from 'pages/SmsChannelPage';
import PushChannelPage from 'pages/PushChannelPage';
import VoiceChannelPage from 'pages/VoiceChannelPage';
import InternetChannelPage from 'pages/InternetChannelPage';
import { isNullOrUndefined } from 'utils/fn';

import { CHANNEL_STUB_INTERNET, CHANNEL_STUB_PUSH, CHANNEL_STUB_SMS, CHANNEL_STUB_VOICE } from '../../constants';
import { NEW_CAMPAIGN_URL } from '../constants';
import TaxonsGroupPage from './TaxonsGroupPage';
import AudienceStepPage from './AudienceStepPage';
import {
  SocialChannelPage,
} from './ChannelsBriefsPages';
import { CampaignSuccessPopup, EmptySelectionPopup } from './containers';

const mergeToolsDtoToView = (savedTools, toolsList) => {
  const toolsDictionary = {};
  savedTools.forEach(item => {
    toolsDictionary[item.id] = item;
  });
  const updatedToolsList = toolsList.map(tool => {
    return {
      ...tool,
      isActive: toolsDictionary.hasOwnProperty(tool.id),
      budget: toolsDictionary.hasOwnProperty(tool.id) && toolsDictionary[tool.id].budget || tool.budget,
    };
  });
  return updatedToolsList;
};

const ChannelsPage = observer(() => {
  const [loading, setLoading] = useState(true);
  const { NewCampaign, Common, WebsAndPhonesTaxons } = useContext(StoresContext);
  useEffect(() => {
    if (!NewCampaign.currentCampaign.selection.id) return;
    (async () => {
      const data = NewCampaign.currentCampaign.orders.find(item => { return item.channel_uid === NewCampaign.currentCampaign.channel_uid; });
      const commonData = dtoToViewDraftData(data);
      switch (NewCampaign.currentCampaign.channel_uid) {
        case CHANNEL_STUB_SMS: {
          await WebsAndPhonesTaxons.defineCurrentOnOfLine();
          runInAction(() => {
            NewCampaign.currentCampaign.currentOrder = {
              ...dtoToViewSmsChannelData(data),
              ...commonData,
              ...NewCampaign.currentCampaign.currentOrder,
              budget: commonData.budget || NewCampaign.currentCampaign.currentOrder.minimalBudget,
            };
          });
          break;
        }

        case CHANNEL_STUB_VOICE: {
          await NewCampaign.getConnectionTypes();
          await NewCampaign.getCallMethods();
          await NewCampaign.getActivityFields();
          runInAction(() => {
            NewCampaign.currentCampaign.currentOrder = {
              ...dtoToViewVoiceChannelData(data),
              ...commonData,
              ...NewCampaign.currentCampaign.currentOrder,
              budget: commonData.budget || NewCampaign.currentCampaign.currentOrder.minimalBudget,
            };
          });
          break;
        }

        case CHANNEL_STUB_PUSH: {
          await WebsAndPhonesTaxons.defineCurrentOnOfLine();
          runInAction(() => {
            NewCampaign.currentCampaign.currentOrder = {
              ...dtoToViewPushChannelData(data),
              ...commonData,
              ...NewCampaign.currentCampaign.currentOrder,
              budget: commonData.budget || NewCampaign.currentCampaign.currentOrder.minimalBudget,
            };
          });
          break;
        }

        case CHANNEL_STUB_INTERNET: {
          await NewCampaign.getTools();
          await Common.getInternetChannelIndustries();
          runInAction(() => {
            NewCampaign.currentCampaign.currentOrder = {
              ...dtoToViewInternetChannelData(data),
              ...commonData,
              ...NewCampaign.currentCampaign.currentOrder,
              tools: commonData.data.tools?.length ? mergeToolsDtoToView(commonData.data.tools, NewCampaign.tools) : NewCampaign.tools,
              budget: commonData.budget || NewCampaign.currentCampaign.currentOrder.minimalBudget,
            };
          });
          await NewCampaign.getCalculate();
          break;
        }

        default:
          break;
      }
      setLoading(false);
    })();
  }, [NewCampaign.currentCampaign.selection.id]);

  if (loading) return null;

  return (
    <Router primary={false}>

      <InternetChannelPage path="internet" />

      <PushChannelPage path="push" />

      <SmsChannelPage path="target-sms" />

      <VoiceChannelPage path="voice-target" />

      <SocialChannelPage path="target-internet" />

      <Redirect path="/*" from="/*" to="../audience" noThrow />
    </Router>
  );
});

const CampaignStepsPages = ({ prevPathname }) => (
  <Router primary={false}>

    <AudienceStepPage path="audience" />

    <TaxonsGroupPage prevPathname={prevPathname} path="audience/:groupId" />

    <ChannelsPage path="channels/*" />

    <Redirect path="/*" from="/*" to="../" noThrow />
  </Router>
);

CampaignStepsPages.propTypes = {
  prevPathname: PropTypes.string,
};

const INTERVAL_REQUEST_ATTEMPTS = 18;
let intervalId = null;

function NewCampaignWrapper() {
  const { NewCampaign, Common, Templates, WebsAndPhonesTaxons, UserInfo } = useContext(StoresContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { pathname } = useLocation();
  const prevPathname = usePrevious(pathname);

  const campaignId = pathname.split('/')[2];

  useEffect(() => {
    if (WebsAndPhonesTaxons.intervalRequestAttempts >= INTERVAL_REQUEST_ATTEMPTS && intervalId) clearInterval(intervalId);
  }, [WebsAndPhonesTaxons.intervalRequestAttempts]);

  useEffect(() => {
    const intervalRequest = async () => {
      const currentOrder = NewCampaign.currentCampaign.orders.find(item => { return item.channel_uid === NewCampaign.currentCampaign.channel_uid; });

      try {
        const newAudience = await axiosAuthorizedRequest({ url: `/api/v1/client/orders/${currentOrder.id}/` });

        if (!isNullOrUndefined(newAudience?.data?.msisdns_count)) {
          NewCampaign.currentCampaign.audience = newAudience?.data?.msisdns_count;
          WebsAndPhonesTaxons.intervalRequestAttempts = 100;
          WebsAndPhonesTaxons.isWebSitesCalculating = false;
        } else WebsAndPhonesTaxons.intervalRequestAttempts += 1;
      } catch (e) {
        NewCampaign.set('audienceError', extractError(e));
        WebsAndPhonesTaxons.intervalRequestAttempts = 100;
        WebsAndPhonesTaxons.isWebSitesCalculating = false;
      }
    };

    const updateCustomSegment = async () => {
      WebsAndPhonesTaxons.intervalRequestAttempts = 0;

      if (WebsAndPhonesTaxons.callIntervalRequests === 'updating') {
        await WebsAndPhonesTaxons.updateCustomSegmentInfo({ type: 'sites' });
      } else if (WebsAndPhonesTaxons.callIntervalRequests === 'checking') {
        WebsAndPhonesTaxons.isWebSitesCalculating = true;
      }

      WebsAndPhonesTaxons.callIntervalRequests = '';
      if (intervalId) clearInterval(intervalId);

      if (WebsAndPhonesTaxons.intervalRequestAttempts <= INTERVAL_REQUEST_ATTEMPTS) {
        intervalId = setInterval(() => intervalRequest(), 10000);
      }
    };

    if (WebsAndPhonesTaxons.callIntervalRequests && WebsAndPhonesTaxons.callIntervalRequests !== 'reset') {
      updateCustomSegment();
    }
    if (WebsAndPhonesTaxons.callIntervalRequests === 'reset' && intervalId) {
      clearInterval(intervalId);
    }
  }, [WebsAndPhonesTaxons.callIntervalRequests]);

  useEffect(() => {
    Promise.all([
      Common.getConstants(),
      UserInfo.getUser(),
      Common.getCampaignsChannelTypes(),
      Templates.getTemplate('newCampaign'),
    ]).finally(() => {
      setIsDataLoading(false);
    });
  }, []);

  useEffect(() => {
    if (window.location.pathname !== `/new-campaign/${NewCampaign.currentCampaign.id}/audience/webSites`) {
      scrollSmoothTo(0);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    (async () => {
      if (Number(campaignId)) {
        let campaignData = null;
        NewCampaign.currentCampaign.currentOrder = {};
        WebsAndPhonesTaxons.resetAllCustomSegments();
        NewCampaign.set('isCampaignInitializing', true);

        try {
          campaignData = await getCampaignRequest(campaignId);
          if (!campaignData.orders.length) {
            NewCampaign.currentCampaign.name = campaignData.name;
            NewCampaign.currentCampaign.id = campaignData.id;
            navigate(`${NEW_CAMPAIGN_URL}?reset=false`);
            return;
          }
          NewCampaign.currentCampaign.channel_uid = campaignData.orders[0].channel_uid;
          NewCampaign.currentCampaign.selection.id = campaignData.selection.id;
        } catch (e) {
          console.log(e);
          throw e;
        }

        await NewCampaign.loadAllTaxonsData();
        NewCampaign.setCurrentCampaign(campaignData);

        await NewCampaign.updateSelection({ isFirstCallForDraft: true });
        NewCampaign.set('isCampaignInitializing', false);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    })();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [campaignId]);

  const location = useLocation();

  useEffect(() => {
    (async () => {
      if (NewCampaign.currentCampaign.id && WebsAndPhonesTaxons.webSitesOnOfLine === 'online') {
        if (WebsAndPhonesTaxons.blackList && WebsAndPhonesTaxons.blackList?.length !== 0) {
          await navigate(`/new-campaign/${NewCampaign.currentCampaign.id}/audience/webSites`);
        } else if (WebsAndPhonesTaxons.shouldCheckForBlackList) {
          await WebsAndPhonesTaxons.loadBlackListVerifying();
        }
      }
    })();
  }, [location.pathname]);

  return (
    <>
      <PageLoader isLoading={isLoading || isDataLoading}>
        <OverlayLoader isLoading={isLoading}>
          <Router primary={false}>
            <ChooseChannels path="/" exact />
            <NameStepPage path="/name" exact />
            <CampaignStepsPages prevPathname={prevPathname} path=":campaignId/*" />
          </Router>

          <CampaignSuccessPopup />

          <EmptySelectionPopup />
        </OverlayLoader>
      </PageLoader>
    </>
  );
}

export default observer(NewCampaignWrapper);
