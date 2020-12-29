import React, { useState, useMemo, useContext } from 'react';
import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Preloader } from 'components/common/index';
import { composeErrorCatchingRequest } from 'requests/helpers';
import { requestOffer } from 'requests/offer';
import { OFFER_ACCEPTED_DATE } from 'store/common/userInfo/constants';
import { setUserCommonInfo } from 'store/common/userInfo/actions';
import { StoresContext } from 'store/mobx';
import checkForInn from 'store/mobx/requests/checkForInn';

import OfferPopup from '../../../OfferPopup';

const userInfoOfferCaughtRequest = composeErrorCatchingRequest(requestOffer);

// READ BEFORE PUT NEW CODE HERE

/*  the goal of this component: determine userInfo rules to render our application
    this component makes only userInfo initialization to put in store and renders children (root Application component)
    either it will renders OfferPopup to confirm rules for next render after refresh application
    don't put another initial requests and store initialization here,

    use withPageInitializator HOC instead inside routes.jsx
*/

export default function AppUserAccessInitializator({ children }) {
  const [isAccessAllowed, setAccess] = useState(false);
  const [offerRequiredTemplate, setOfferTemplate] = useState(null);

  const { UserInfo } = useContext(StoresContext);

  const dispatch = useDispatch();
  const isJustLoggedIn = localStorage.getItem('isJustLoggedIn');

  useMemo(async () => {
    await UserInfo.getUser();
    const hasOfferAccepted = !!UserInfo.data?.[OFFER_ACCEPTED_DATE];

    // TODO: remove when move to MobX completely
    dispatch(setUserCommonInfo(toJS(UserInfo.data)));

    if (!hasOfferAccepted) {
      const { offer } = await userInfoOfferCaughtRequest();
      setOfferTemplate(offer);
    } else {
      setAccess(true);

      if (isJustLoggedIn === 'string_true') {
        if (UserInfo.data?.full_access_form) await checkForInn(null, null, {}, { isWithoutCheckInn: true });

        localStorage.setItem('isJustLoggedIn', 'string_false');
      }
    }
  }, []);

  if (isAccessAllowed) {
    return children;
  } else if (offerRequiredTemplate) {
    return <OfferPopup template={offerRequiredTemplate} />;
  }
  return <Preloader />;
}

AppUserAccessInitializator.propTypes = {
  children: PropTypes.node,
};
