import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from '@reach/router';
import { observer } from 'mobx-react';
import { runInAction, set, toJS } from 'mobx';
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
import { FFSelect } from 'components/fields';
import Heading from 'components/layouts/Heading';
import { LightText } from 'components/common';
import { OverlayLoader } from 'components/common/Loaders';
import commonStyles from 'styles/common.pcss';
import { Disclaimer } from 'pages/Dashboard/components';
import CustomSegmentNotifyModal from 'components/modals/CustomSegmentNotifyModal';

import { StepLayout, StepHeading } from '../../components';
import { SegmentationWrapper } from '../../containers';
import UploadFiles from '../containers/UploadFiles';
import ManuallyAddedNumbers from '../containers/ManuallyAddedNumbers';

import SuccessIcon from '../WebSitesTaxonPage/icons/success.svg';
import ErrorIcon from '../WebSitesTaxonPage/icons/error.svg';

import styles from './styles.pcss';

function PhoneNumbersTaxonPage({ prevPathname }) {
  const {
    Templates: { getNewCampaignTemplate },
    NewCampaign,
    WebsAndPhonesTaxons,
  } = useContext(StoresContext);

  const navigate = useNavigate();

  const {
    title,
    boldSubtitle,
    subtitle,
    proTariffLink,
    callDirectionLabel,
    chooseDepthTitle,
    loadfilesDescription,
    loadFilesText,
    loadFilesButton,
    loadFilesFormatLabel,
    templateLink,
    maxCount,
    minCount,
  } = getNewCampaignTemplate('PhoneNumbersTaxon');

  const { text } = getNewCampaignTemplate('SegmentsDisclaimer');
  const [isShowingModal, setIsShowingModal] = useState(false);
  let updateSegmentTimeout = null;

  const handleSaveSegment = async () => {
    if (
      WebsAndPhonesTaxons.checkForPhoneNumbersMinValidation ||
      WebsAndPhonesTaxons.phoneNumbersTaxonCountLeftNegative < 0
    ) {
      WebsAndPhonesTaxons.set('isShowMinPhoneNumbersError', true);
      return;
    }

    await WebsAndPhonesTaxons.updatePhonesSegmentInfo();
    if (WebsAndPhonesTaxons.phoneNumbersRequestError) return;

    await WebsAndPhonesTaxons.updateCustomSegmentInfo({ type: 'phones' });
    if (NewCampaign.audienceError.length) return;

    if (prevPathname.includes('channels')) {
      navigate(prevPathname);
    } else {
      navigate('./');
    }
  };

  const handleChange = async (formValue) => {
    if (WebsAndPhonesTaxons.webSitesOnOfLine === 'online' &&
      WebsAndPhonesTaxons.webSitesTaxon.manuallySites.length) {
      setIsShowingModal(true);
    }

    const prevPhoneNumbersCount = WebsAndPhonesTaxons.phoneNumbersCount;
    if (updateSegmentTimeout) clearTimeout(updateSegmentTimeout);

    set(WebsAndPhonesTaxons.phoneNumbersTaxon, formValue);

    WebsAndPhonesTaxons.set('isPhonesChanged', true);

    if (prevPhoneNumbersCount !== formValue.manuallyNumbers.length) {
      if (WebsAndPhonesTaxons.phoneNumbersTaxon?.manuallyNumbers?.length < +minCount) {
        WebsAndPhonesTaxons.set('isShowMinPhoneNumbersError', true);
      }

      if (WebsAndPhonesTaxons.phoneNumbersTaxon?.manuallyNumbers?.length >= +minCount) {
        await WebsAndPhonesTaxons.updatePhonesSegmentInfo();

        updateSegmentTimeout = setTimeout(() => WebsAndPhonesTaxons.updateCustomSegmentInfo({ type: 'phones' }), 3000);
      } else if (WebsAndPhonesTaxons.phoneNumbersTaxon?.manuallyNumbers?.length === 0) {
        WebsAndPhonesTaxons.clearAllManuallyAddedPhonesOnServer();

        runInAction(() => {
          NewCampaign.currentCampaign.audience = NewCampaign.currentCampaign?.selection?.audience;
          WebsAndPhonesTaxons.isPhonesChanged = false;
          WebsAndPhonesTaxons.set('isShowMinPhoneNumbersError', false);
        });
      }
    }
  };

  const handleFilesAdded = async (files) => {
    await WebsAndPhonesTaxons.phoneHandleFilesAdded(files);

    if (WebsAndPhonesTaxons.errorPhoneFiles.length) return;
    WebsAndPhonesTaxons.set('isPhonesChanged', true);

    if (WebsAndPhonesTaxons.phoneNumbersTaxon?.manuallyNumbers?.length >= +minCount) {
      await WebsAndPhonesTaxons.updatePhonesSegmentInfo();
    }

    if (WebsAndPhonesTaxons.phoneNumbersRequestError.length) return;

    updateSegmentTimeout = setTimeout(() => WebsAndPhonesTaxons.updateCustomSegmentInfo({ type: 'phones' }), 3000);
  };

  const callDirectionOptions = [
    { label: 'Не важно', value: '' },
    { label: 'Исходящий', value: 'outgoing' },
    { label: 'Входящий', value: 'incoming' },
  ];

  useEffect(() => {
    const depthRequest = async () => {
      await WebsAndPhonesTaxons.defineCurrentOnOfLine();

      if (WebsAndPhonesTaxons.webSitesOnOfLine === 'online' &&
        WebsAndPhonesTaxons.webSitesTaxon.manuallySites.length) {
        setIsShowingModal(true);
      }
    };

    depthRequest();

    return () => {
      if (updateSegmentTimeout) clearTimeout(updateSegmentTimeout);
    };
  }, []);

  return (
    <PageLayout>
      <OverlayLoader isLoading={WebsAndPhonesTaxons.loadingFormPhones}>
        <SegmentationWrapper isSticky={false}>
          <StepLayout className={classNames(styles.layout, commonStyles['marb-s'])} isStretched>
            <FinalForm
              className={commonStyles['marb-m']}
              onChange={handleChange}
              values={toJS({
                callDirection: WebsAndPhonesTaxons?.phoneNumbersTaxon?.callDirection || '',
                manuallyNumbers: WebsAndPhonesTaxons?.phoneNumbersTaxon?.manuallyNumbers?.peek() || [],
                event_depth: WebsAndPhonesTaxons?.phoneNumbersTaxon?.event_depth,
              })}
            >
              <BackLink onClick={() => navigate(-1)} className={styles.backlink} />

              <StepHeading title={title} />

              <Heading level={5} isBold>{boldSubtitle}</Heading>

              <Heading level={5} className={styles.textParagraph}>
                {subtitle}
                <IconLink target="_blank" href={proTariffLink} slug="">третьей</IconLink> или <IconLink target="_blank" href={proTariffLink} slug="">четвёртой</IconLink> группе таргетов (онлайн).
              </Heading>

              <div className={classNames(styles.flexLineContainer, styles.callDirectionLabel)}>
                <div className={styles.margionedBlock}>
                  <Heading level={4}>
                    {callDirectionLabel}
                  </Heading>
                  <FFSelect name="callDirection" options={callDirectionOptions} className={styles.select} />
                </div>

                <div>
                  <Heading level={4} className={styles.select}>
                    {chooseDepthTitle}
                  </Heading>

                  <FFSelect
                    className={styles.select}
                    name="event_depth"
                    options={WebsAndPhonesTaxons.depthOptions?.peek() || [{ id: '', label: '' }]}
                  />
                </div>
              </div>

              <LightText className={classNames(styles.textParagraph, styles.marginBottomBlock)}>
                {loadfilesDescription}
              </LightText>

              <div className={styles.flexLineContainer}>
                <LightText className={styles.iconText}>
                  <SuccessIcon className={styles.icon} /> +7 123 321 32 32
                </LightText>

                <LightText className={styles.iconText}>
                  <SuccessIcon className={styles.icon} /> +71233213232
                </LightText>

                <LightText className={styles.iconText}>
                  <SuccessIcon className={styles.icon} /> 0500
                </LightText>

                <LightText className={styles.iconText}>
                  <ErrorIcon className={styles.icon} /> 89321312313
                </LightText>
              </div>

              <UploadFiles
                name="uploadFiles"
                onFilesAdded={handleFilesAdded}
                uploadFilesText={loadFilesText}
                uploadFilesButton={loadFilesButton}
                formatLabel={loadFilesFormatLabel}
                templateLink={templateLink}
              />

              {WebsAndPhonesTaxons.errorPhoneFiles && (
                <div className={styles.error}>{WebsAndPhonesTaxons.errorPhoneFiles}</div>
              )}

              <ManuallyAddedNumbers name="manuallyNumbers" />

              <ActionButton
                onClick={handleSaveSegment}
                className={styles.saveButton}
                type="button"
                iconSlug="arrowRightMinimal"
              >
                Сохранить
              </ActionButton>

              {WebsAndPhonesTaxons.phoneNumbersTaxonCountLeftNegative < 0 &&
                <div className={styles.error}>
                  Превышено максимально допустимое количество сайтов - {maxCount}. Загрузите новый файл.
                </div>
              }

              {WebsAndPhonesTaxons.phoneNumbersRequestError &&
                <div className={classNames(styles.error, styles.boldText)}>
                  {WebsAndPhonesTaxons.phoneNumbersRequestError}
                </div>
              }

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
        WebsAndPhonesTaxons.webSitesTaxon.manuallySites.length && (
          <CustomSegmentNotifyModal
            title="Параметры «Телефонные номера» и «Веб-сайты онлайн» не используются одновременно"
            description="Если вы хотите выбрать параметр «Телефонные номера», то загруженные данные в параметре «Веб-сайты онлайн» не будут сохранены"
            onConfirm={() => {
              setIsShowingModal(false);
              WebsAndPhonesTaxons.resetWebSitesTaxon();
            }}
            onCancel={() => {
              setIsShowingModal(false);
            }}
          />
        )}
      </OverlayLoader>
    </PageLayout>
  );
}

PhoneNumbersTaxonPage.propTypes = {
  prevPathname: PropTypes.string,
};

export default observer(PhoneNumbersTaxonPage);
