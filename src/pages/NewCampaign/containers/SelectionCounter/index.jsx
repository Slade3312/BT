import React, { useContext } from 'react';

import { useLocation } from '@reach/router';
import { observer } from 'mobx-react';
import { useSelector } from 'react-redux';
import { isNullOrUndefined, wordFormByCount } from 'utils/fn';
import { formatPrice } from 'utils/formatting';
import { Heading } from 'components/layouts';
import { LightText } from 'components/common';

import { StoresContext } from 'store/mobx';
import { getPushSelectionCount, getPushSelectionIsActive, getSelectionCount } from 'store/NewCampaign/controls/selectors';
import { getOrderTargetSmsData } from 'store/NewCampaign/storage/selectors';
import LoaderIcon from './loader.svg';

import styles from './styles.pcss';

function SelectionCounter() {
  const { NewCampaign, WebsAndPhonesTaxons } = useContext(StoresContext);

  const location = useLocation();
  const internetChannelActive = location.pathname.includes('internet');
  const voiceChannelActive = location.pathname.includes('voice-target');
  const smsChannelActive = location.pathname.includes('target-sms');

  const isPushActive = useSelector(getPushSelectionIsActive);

  const count = useSelector(getSelectionCount);
  const pushCount = useSelector(getPushSelectionCount);
  const { use_online_geo } = useSelector(getOrderTargetSmsData);

  /* переделать все эти условия через MobX */
  let audienceCount = 0;

  if (isPushActive) audienceCount = pushCount;

  else if (smsChannelActive && NewCampaign.currentCampaign.audience && use_online_geo) {
    audienceCount = NewCampaign.currentCampaign.audience;
  } else if (
    !isPushActive && (!smsChannelActive && NewCampaign.currentCampaign.audience === undefined && !use_online_geo)
  ) {
    audienceCount = count;
  } else if (NewCampaign.currentCampaign.audience) {
    audienceCount = NewCampaign.currentCampaign.audience;
  }

  const renderWidgetContent = () => {
    const audienceForms = ['человек', 'человека', 'человек'];

    if ((WebsAndPhonesTaxons.webSitesOnOfLine === 'online' && WebsAndPhonesTaxons.webSitesTaxon.manuallySites.length !== 0) ||
      WebsAndPhonesTaxons.phonesOnOfLine === 'online') {
      return <LightText>Аудитория собирается в онлайн режиме</LightText>;
    } else if (WebsAndPhonesTaxons.phonesOnOfLine === 'offline' &&
      WebsAndPhonesTaxons.webSitesOnOfLine !== 'online' &&
      WebsAndPhonesTaxons.isPhonesChanged) {
      return <LightText>Мы подсчитаем вашу аудиторию в течение суток</LightText>;
    } else if (
      WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
      WebsAndPhonesTaxons.isWebSitesCalculating &&
      !WebsAndPhonesTaxons.isPhonesChanged
    ) {
      return (
        <LightText className={styles.flexSpan}>
          {WebsAndPhonesTaxons.isWebSitesCalculating && <LoaderIcon className={styles.loaderIcon} />}
          Подождите 2 минуты, идет подбор аудитории
        </LightText>
      );
    } else if (!WebsAndPhonesTaxons.isPhonesChanged && !WebsAndPhonesTaxons.isWebSitesCalculating &&
      !isNullOrUndefined(NewCampaign.currentCampaign.audience)) {
      return (
        <span className={styles.count}>
          {formatPrice(NewCampaign.currentCampaign.audience)
            ? (<>{formatPrice(NewCampaign.currentCampaign.audience)}
              <span className={styles.countLabel}>
                {` ${wordFormByCount(NewCampaign.currentCampaign.audience, audienceForms)}`}
              </span></>
            ) : <LoaderIcon className={styles.loaderIcon} />}
        </span>
      );
    }
    return '';
  };

  return (
    <Heading level={4}>
      {NewCampaign.audienceError.length
        ? <p className={styles.error}>{NewCampaign.audienceError}</p>
        : (<>
          <div>Ваша аудитория:</div>

          {renderWidgetContent() || ''}
        </>)
      }
    </Heading>
  );
}

export default observer(SelectionCounter);
