import React, { useState, useContext, useEffect } from 'react';
import { navigate, useLocation } from '@reach/router';
import { observer } from 'mobx-react';
import { runInAction, set } from 'mobx';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { StoresContext } from 'store/mobx';
import { FeedbackBanner } from 'widgets';
import PageLayout from 'pages/_PageLayout';
import { ActionButton, BackLink } from 'components/buttons';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from 'containers/ChatWidget';
import { IconLink } from 'components/buttons/IconLinks';
import { FinalForm } from 'components/forms/index';
import Heading from 'components/layouts/Heading';
import { LightText } from 'components/common';
import { OverlayLoader } from 'components/common/Loaders';
import commonStyles from 'styles/common.pcss';
import { Disclaimer } from 'pages/Dashboard/components';
import { RadioGroup, FFSelect, FFRadioBoxGroup } from 'components/fields';
import CustomSegmentNotifyModal from 'components/modals/CustomSegmentNotifyModal';
import BlackListLoaderModal from 'components/modals/BlackListLoaderModal';

import OnOfLineRadioItem from '../components/OnOfLineRadioItem';
import { StepLayout, StepHeading } from '../../components';
import { SegmentationWrapper } from '../../containers';
import UploadFiles from '../containers/UploadFiles';
import ManuallyAddedSites from '../containers/ManuallyAddedSites';
import ErrorIcon from './icons/error.svg';
import SuccessIcon from './icons/success.svg';
import styles from './styles.pcss';

let updateSegmentTimeout = null;

function WebSitesTaxonPage({ prevPathname }) {
  const {
    Templates: { getNewCampaignTemplate },
    NewCampaign,
    WebsAndPhonesTaxons,
  } = useContext(StoresContext);

  const {
    title,
    boldSubtitle,
    subtitle,
    proTariffLink,
    chooseDepthTitle,
    chooseDelayTitle,
    chooseDelayDescription,
    loadFilesTitle,
    loadfilesDescription,
    loadFilesText,
    loadFilesButton,
    loadFilesFormatLabel,
    templateLink,
    maxCount,
    minCount,
  } = getNewCampaignTemplate('WebSitesTaxon');

  const { text } = getNewCampaignTemplate('SegmentsDisclaimer');
  const [isShowingModal, setIsShowingModal] = useState(false);

  const updatingSitesRequests = async (isWithoutDelay) => {
    await WebsAndPhonesTaxons.updateWebSitesSegmentInfo();
    if (WebsAndPhonesTaxons.webSitesRequestError.length) return;

    if (WebsAndPhonesTaxons.webSitesOnOfLine === 'offline') {
      if (!isWithoutDelay) {
        updateSegmentTimeout = setTimeout(() => {
          WebsAndPhonesTaxons.callIntervalRequests = 'updating';
        }, 3000);
      } else WebsAndPhonesTaxons.callIntervalRequests = 'updating';
    }
  };

  const handleSaveSegment = async () => {
    if (WebsAndPhonesTaxons.manuallyWebSitesCount < +minCount ||
      WebsAndPhonesTaxons.websitesTaxonCountLeftNegative < 0 ||
      WebsAndPhonesTaxons.manuallyAddedWebSitesError
    ) {
      WebsAndPhonesTaxons.set('isShowMinWebsitesError', true);
      return;
    }

    if (WebsAndPhonesTaxons.webSitesOnOfLine === 'online') {
      await WebsAndPhonesTaxons.loadBlackListVerifying();
      if (WebsAndPhonesTaxons.webSitesRequestError) return;

      if (!WebsAndPhonesTaxons.blackList.length) {
        await WebsAndPhonesTaxons.updateWebSitesSegmentInfo();
        if (WebsAndPhonesTaxons.webSitesRequestError) return;

        if (prevPathname.includes('channels')) {
          navigate(prevPathname);
        } else {
          navigate('./');
        }
      }
    } else if (WebsAndPhonesTaxons.webSitesOnOfLine === 'offline') {
      await updatingSitesRequests();

      if (prevPathname.includes('channels')) {
        navigate(prevPathname);
      } else {
        navigate('./');
      }
    }
  };

  const handleChange = async (formValue) => {
    const prevWebSitesCount = WebsAndPhonesTaxons.manuallyWebSitesCount;

    set(WebsAndPhonesTaxons.webSitesTaxon, formValue);
    WebsAndPhonesTaxons.shouldCheckForBlackList = true;

    const removedBlackListItem = WebsAndPhonesTaxons.blackList
      ? WebsAndPhonesTaxons.blackList.find(item => !formValue.manuallySites.includes(item))
      : '';
    if (removedBlackListItem) WebsAndPhonesTaxons.blackList.remove(removedBlackListItem);

    if (!WebsAndPhonesTaxons.blackList || (WebsAndPhonesTaxons.blackList && WebsAndPhonesTaxons.blackList.length === 0)) {
      WebsAndPhonesTaxons.set('manuallyAddedWebSitesError', '');
    }

    if (prevWebSitesCount !== formValue.manuallySites.length) {
      if (updateSegmentTimeout) clearTimeout(updateSegmentTimeout);

      if (WebsAndPhonesTaxons.webSitesTaxon?.manuallySites?.length < +minCount) {
        WebsAndPhonesTaxons.set('isShowMinWebsitesError', true);
      }

      if (WebsAndPhonesTaxons.webSitesTaxon?.manuallySites?.length >= +minCount) {
        await updatingSitesRequests();
      } else if (WebsAndPhonesTaxons.webSitesTaxon?.manuallySites?.length === 0) {
        WebsAndPhonesTaxons.clearAllManuallyAddedWebSitesOnServer();

        runInAction(() => {
          NewCampaign.currentCampaign.audience = NewCampaign.currentCampaign?.selection?.audience;
          WebsAndPhonesTaxons.isWebSitesCalculating = false;
          WebsAndPhonesTaxons.set('isShowMinWebsitesError', false);
          WebsAndPhonesTaxons.callIntervalRequests = 'reset';
        });
      }
    }
  };

  const handleOnOfLineChange = (newValue) => {
    WebsAndPhonesTaxons.set('webSitesOnOfLine', newValue);

    if (!WebsAndPhonesTaxons.loadingFormWebSites && WebsAndPhonesTaxons.webSitesOnOfLine) {
      if (WebsAndPhonesTaxons.webSitesOnOfLine === 'online') {
        WebsAndPhonesTaxons.webSitesTaxon.event_depth = WebsAndPhonesTaxons?.delayOptions
          ? WebsAndPhonesTaxons?.delayOptions[0]?.value
          : null;

        if (WebsAndPhonesTaxons.phoneNumbersTaxon.manuallyNumbers.length) {
          setIsShowingModal(true);
        }

        WebsAndPhonesTaxons.callIntervalRequests = 'reset';
      }
      if (WebsAndPhonesTaxons.webSitesOnOfLine === 'offline') {
        WebsAndPhonesTaxons.webSitesTaxon.event_depth = WebsAndPhonesTaxons?.depthOptions
          ? WebsAndPhonesTaxons?.depthOptions[0]?.value
          : null;
        WebsAndPhonesTaxons.blackList = [];
        WebsAndPhonesTaxons.set('manuallyAddedWebSitesError', '');
      }
    }
  };

  const handleFilesAdded = async (files) => {
    await WebsAndPhonesTaxons.webSitesHandleFilesAdded(files);

    if (WebsAndPhonesTaxons.errorWebSiteFiles.length) return;

    if (WebsAndPhonesTaxons.webSitesTaxon?.manuallySites?.length < +minCount) {
      WebsAndPhonesTaxons.set('isShowMinWebsitesError', true);
    }

    if (WebsAndPhonesTaxons.webSitesTaxon?.manuallySites?.length >= +minCount) {
      WebsAndPhonesTaxons.isWebSitesCalculating = true;
      await updatingSitesRequests(true);
    }
  };

  const radioBoxGroupOptions = [
    { label: 'Офлайн', value: 'offline', description: 'Использует данные из прошлых периодов' },
    { label: 'Онлайн', value: 'online', description: 'Использует данные с даты подачи вашей заявки' },
  ];

  useEffect(() => {
    WebsAndPhonesTaxons.shouldCheckForBlackList = true;

    const depthRequest = async () => {
      await WebsAndPhonesTaxons.defineCurrentOnOfLine();

      if (WebsAndPhonesTaxons.webSitesOnOfLine === 'online' &&
        WebsAndPhonesTaxons.phoneNumbersTaxon.manuallyNumbers.length) {
        setIsShowingModal(true);
      }
    };

    depthRequest();
  }, []);

  return (
    <PageLayout>
      <OverlayLoader isLoading={WebsAndPhonesTaxons.loadingFormWebSites}>
        <SegmentationWrapper isSticky={false}>
          <StepLayout className={classNames(styles.layout, commonStyles['marb-s'])} isStretched>
            <FinalForm
              className={commonStyles['marb-m']}
              onChange={handleChange}
              values={{
                manuallySites: WebsAndPhonesTaxons?.webSitesTaxon?.manuallySites?.peek(),
                files: WebsAndPhonesTaxons?.webSitesTaxon?.files?.peek(),
                event_depth: WebsAndPhonesTaxons?.webSitesTaxon?.event_depth,
              }}
            >
              <BackLink className={styles.backlink} onClick={() => navigate(-1)} />

              <StepHeading title={title} />

              <Heading level={5} isBold>{boldSubtitle}</Heading>

              <Heading level={5} className={classNames(styles.textParagraph, styles.subtitleMargin)}>
                {subtitle}
                <IconLink target="_blank" href={proTariffLink} slug="">третьей</IconLink> или <IconLink target="_blank" href={proTariffLink} slug="">четвёртой</IconLink> группе таргетов (онлайн).
              </Heading>

              <RadioGroup
                defaultValue={radioBoxGroupOptions[0].value}
                options={radioBoxGroupOptions}
                onChange={handleOnOfLineChange}
                value={WebsAndPhonesTaxons.webSitesOnOfLine}
                ItemComponent={OnOfLineRadioItem}
                className={styles.subtitleMargin}
              />

              {WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' && (<>
                <Heading level={4} className={classNames(styles.chooseDepthTitle)}>
                  {chooseDepthTitle}
                </Heading>

                <FFSelect
                  defaultValue={WebsAndPhonesTaxons.depthOptions ? WebsAndPhonesTaxons.depthOptions[0]?.value : 0}
                  className={styles.select}
                  name="event_depth"
                  options={WebsAndPhonesTaxons.depthOptions?.peek() || [{ id: '', label: '' }]}
                />
              </>)}

              {WebsAndPhonesTaxons.webSitesOnOfLine === 'online' && (<>
                <Heading level={4} className={classNames(styles.chooseDepthTitle)}>
                  {chooseDelayTitle}
                </Heading>

                <LightText className={styles.textParagraph}>
                  {chooseDelayDescription}
                </LightText>

                <FFRadioBoxGroup
                  defaultValue={WebsAndPhonesTaxons.delayOptions[0]?.value}
                  options={WebsAndPhonesTaxons.delayOptions}
                  name="event_depth"
                />
              </>)}

              <Heading level={4} className={styles.loadFilesTitle}>{loadFilesTitle}</Heading>

              <LightText className={styles.textParagraph}>
                {loadfilesDescription}
              </LightText>

              <div className={styles.flexCenter}>
                <LightText className={styles.iconText}>
                  <SuccessIcon className={styles.icon} /> sport.ru
                </LightText>

                <LightText className={styles.iconText}>
                  <ErrorIcon className={styles.icon} /> sport.ru/product/15Bh/imagen/1235
                </LightText>
              </div>

              <UploadFiles
                onFilesAdded={handleFilesAdded}
                uploadFilesText={loadFilesText}
                uploadFilesButton={loadFilesButton}
                formatLabel={loadFilesFormatLabel}
                templateLink={templateLink}
              />

              {WebsAndPhonesTaxons.errorWebSiteFiles && (
                <div className={styles.error}>{WebsAndPhonesTaxons.errorWebSiteFiles}</div>
              )}

              <ManuallyAddedSites onAddedSite={updatingSitesRequests} />

              {WebsAndPhonesTaxons.websitesTaxonCountLeftNegative < 0 &&
                <div className={styles.error}>
                  Превышено максимально допустимое количество сайтов - {maxCount}. Загрузите новый файл.
                </div>
              }

              <ActionButton
                onClick={handleSaveSegment}
                className={styles.saveButton}
                type="button"
                iconSlug="arrowRightMinimal"
              >
                Сохранить
              </ActionButton>

            </FinalForm>

            <Disclaimer>
              {text}
            </Disclaimer>
          </StepLayout>
        </SegmentationWrapper>

        <FeedbackBanner />

        <ChatWidget />

        <QuestionWidget />

        {isShowingModal &&
        WebsAndPhonesTaxons.webSitesOnOfLine === 'online' &&
        WebsAndPhonesTaxons.phoneNumbersTaxon.manuallyNumbers.length && (
          <CustomSegmentNotifyModal
            title="Параметры «Веб-сайты онлайн» и «Телефонные номера» не используются одновременно"
            description="Если вы хотите выбрать параметр «Веб-сайты онлайн», то загруженные данные в параметре «Телефонные номера» не будут сохранены"
            onConfirm={() => {
              setIsShowingModal(false);
              WebsAndPhonesTaxons.resetPhoneNumbersTaxon();
            }}
            onCancel={() => {
              setIsShowingModal(false);
              WebsAndPhonesTaxons.set('webSitesOnOfLine', 'offline');
            }}
          />
        )}

        {WebsAndPhonesTaxons.isShowingLoaderModal && (
          <BlackListLoaderModal
            title="Проверка информации"
            description="Мы проверяем введенные данные. Это может занять до 30 сек."
          />
        )}
      </OverlayLoader>
    </PageLayout>
  );
}

WebSitesTaxonPage.propTypes = {
  prevPathname: PropTypes.string,
};

export default observer(WebSitesTaxonPage);
