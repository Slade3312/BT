import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useSelector } from 'react-redux';
import { StepHeading } from 'pages/NewCampaign/components';
import { Stepper, Step } from 'components/common/Stepper';
import AdCreatingForm from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/containers/AdCreating/AdCreatingForm';
import ChooseTariffsStep from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/containers/ChooseTariffsStep';
import TotalInfoTargetInternet from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/containers/TotalInfoTargetInternet';
import {
  OverlayLoader,
  ReplaceLoader,
} from 'components/common/Loaders/components';
import { StoresContext } from 'store/mobx';
import ErrorOnlyForCompanies from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/containers/ErrorOnlyForCompanies';
import ChosenTariffsCompleted from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/containers/ChosenTariffsCompleted';
import { getCampaignLoaders } from 'store/NewCampaign/campaign/selectors';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';
import BriefErrorsInfo from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/components/BriefErrorsInfo';
import TotalTargetInternetEditModeration from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/containers/TotalTargetInternetEdit';
import CompleteModerationModal
  from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/containers/ConfirmEditModal';
import { SegmentationWrapper } from 'pages/NewCampaign/containers';
import { scrollSmoothToNode } from 'utils/scroll';

import TariffInfoLink from '../components/TariffInfoLink';
import ReturnButton from './containers/ReturnButton';
import AdCreating from './containers/AdCreating';
import AdCreatingCompleted from './containers/AdCreatingCompleted';
import СompanyInfo from './containers/СompanyInfo';
import СompanyInfoCompleted from './containers/СompanyInfoCompleted';
import styles from './styles.pcss';

const SocialChannelPage = () => {
  const stepperRef = useRef();
  const [disclaimer, showDisclaimer] = useState(false);
  const [isModerationModalOpen, setIsModerationModalOpened] = useState(false);
  const [isCampaignLoading, setIsCampaignLoading] = useState(false);

  const handleAfterSave = () => {
    setIsCampaignLoading(false);
    setIsModerationModalOpened(true);
  };

  const handleBeforeSave = () => {
    setIsCampaignLoading(true);
  };

  const { Social, NewCampaign, UserInfo } = useContext(StoresContext);
  const isLoading = useSelector(getCampaignLoaders)[
    CHANNEL_STUB_TARGET_INTERNET
  ];

  const isModerationMode = NewCampaign.getIsCampaignInTargetInternetModeration;

  const [step, setActiveStep] = useState(isModerationMode ? -1 : 1);
  const [wasOpened, setWasOpened] = useState(isModerationMode ? [1, 2, 3] : [1]);

  const changeStep = stepToGo => {
    if (!wasOpened.includes(stepToGo)) {
      setWasOpened([stepToGo, ...wasOpened]);
    }
    setActiveStep(stepToGo);
  };

  useEffect(() => {
    if (!UserInfo?.data?.company?.inn) showDisclaimer(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Social.loadIndustries();
      await NewCampaign.getOrdersHolidays('social');
    };

    loadData();
  }, []);

  const SegmentationWrapperOrChildren = useCallback(({ children }) => {
    if (!isModerationMode) {
      return <SegmentationWrapper isSticky={false}>{children}</SegmentationWrapper>;
    }
    return children;
  }, [isModerationMode]);


  const handleSetNextStep = (nextStepInd) => {
    const nextStepNode = stepperRef.current.children[nextStepInd - 1];

    changeStep(nextStepInd);

    requestAnimationFrame(() => {
      scrollSmoothToNode(nextStepNode);
    });
  };

  return (
    <div className={styles.container}>
      <OverlayLoader isLoading={isLoading}>
        {!isModerationMode ? (
          <ReturnButton />
        ) : (
          <div className={styles.topIndent} />
        )}

        <AdCreatingForm>
          {({ isStepChosenTariffsValid, isStepСompanyInfoValid, isStepAdCreatingValid }) => {
              return (
                <>
                  <div className={styles.wrapper}>
                    <SegmentationWrapperOrChildren>
                      <div className={styles.header}>
                        {!isModerationMode ? (
                          <>
                            <StepHeading
                              title="Таргетированная реклама"
                              description="Таргетированная реклама в соцсетях привлечет новых клиентов, повысит узнаваемость вашего брэнда. Создавайте объявления сами, используя свои креативы и тексты."
                          />
                            <div className={styles.iconsWrapper}>
                              <img
                                src="https://static.beeline.ru/upload/images/marketing/mytarget.svg"
                                alt="socials"
                                className={styles.socials}
                              />
                            </div>

                            <TariffInfoLink
                              href="https://static.beeline.ru/upload/images/marketing/price_internet2.pdf"
                              afterLinkText="(PDF, 2 МБ)"
                              iconSlug="pdf"
                            />
                          </>
                      ) : (
                        <>
                          <StepHeading title="Редактирование брифа" />
                          <BriefErrorsInfo
                            items={NewCampaign.getTargetInternetErrors}
                          />
                        </>
                      )}
                      </div>
                      <div className={styles.contentWrapper}>
                        <Stepper
                          ref={stepperRef}
                          className={styles.wizardWrapper}
                          openedContainerClass={styles.secondStep}
                          step={step}
                          >
                          <Step
                            isActive={step === 1}
                            wasOpened={wasOpened.includes(1)}
                            isCompleted={isStepAdCreatingValid && wasOpened.includes(1)}
                            openedComponent={<AdCreating setNextStep={() => handleSetNextStep(2)} />}
                            closedComponent={<AdCreatingCompleted onChange={() => changeStep(1)}/>}
                            setActiveStep={() => changeStep(1)}
                            title="Создание объявления"
                          />
                          <Step
                            isCompleted={isStepСompanyInfoValid && wasOpened.includes(2)}
                            wasOpened={wasOpened.includes(2)}
                            isActive={step === 2}
                            openedComponent={<СompanyInfo setNextStep={() => handleSetNextStep(3)} />}
                            closedComponent={<СompanyInfoCompleted onChange={() => changeStep(2)} />}
                            setActiveStep={() => changeStep(2)}
                            title="Внесение данных о компании"
                          />
                          <Step
                            isCompleted={isStepChosenTariffsValid && wasOpened.includes(3)}
                            isActive={step === 3}
                            wasOpened={wasOpened.includes(3)}
                            openedComponent={<ChooseTariffsStep />}
                            closedComponent={<ChosenTariffsCompleted onChange={() => setActiveStep(3)} />}
                            setActiveStep={() => changeStep(3)}
                            title="Выбор даты и тарифа"
                          />
                        </Stepper>
                      </div>


                    </SegmentationWrapperOrChildren>
                  </div>

                  {(isModerationMode || (step === 3)) && (
                    <ReplaceLoader
                      className={styles.totalLoader}
                      isLoading={Social.isTariffsLoading}
                    >
                      {!isModerationMode ? (
                        <TotalInfoTargetInternet
                          onSetActiveStep={setActiveStep}
                        />
                      ) : (
                        <TotalTargetInternetEditModeration
                          onSetActiveStep={setActiveStep}
                          onBeforeSave={handleBeforeSave}
                          onAfterSave={handleAfterSave}
                        />
                      )}
                    </ReplaceLoader>
                  )}

                  {isModerationModalOpen && (
                    <CompleteModerationModal setIsModalOpened={setIsModerationModalOpened} isLoading={isCampaignLoading} />
                  )}

                  {
                    disclaimer &&
                    <ErrorOnlyForCompanies setIsModalOpened={showDisclaimer} />
                  }

                  <div className={styles.bottomIndent} />
                </>
            );
          }}
        </AdCreatingForm>
      </OverlayLoader>
    </div>
  );
};

export default observer(SocialChannelPage);
