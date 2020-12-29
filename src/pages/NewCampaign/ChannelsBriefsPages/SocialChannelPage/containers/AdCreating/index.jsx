import React, { useRef, useContext, useEffect } from 'react';
import { useFormState } from 'react-final-form';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import confirmDialog from 'components/modals/confirmDialog';
import EditImage from 'components/modals/EditImage';
import EditLogo from 'components/modals/EditLogo';
import Heading from 'components/layouts/Heading';
import { ActionButton } from 'components/buttons';
import GlobalIcon from 'components/common/GlobalIcon';
import { StoresContext } from 'store/mobx';
import { FFTextInput, FFCheckbox, FFTextArea, FFSelect } from 'components/fields';
import Tooltip from 'components/common/Tooltip';
import {
  stepAdCreatingIndicators,
} from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/constants';
import { MAX_CHARS_TITLE, MAX_CHARS_DESCRIPTION, ADCREATINGFORM } from 'pages/NewCampaign/constants';
import AdPreview from '../AdPreview';
import styles from './styles.pcss';

const AdCreating = ({ setNextStep }) => {
  const logo = useRef();
  const mainImg = useRef();
  const submitBtn = useRef();
  const { Social, Templates } = useContext(StoresContext);
  const { getNewCampaignTemplate } = Templates;
  const { adTitle, adDescription, adLogo, adMainImg, adWebsite } = getNewCampaignTemplate('BriefOrderTargetInternet');
  const onChooseMainImg = async (e) => {
    console.log(mainImg.current.value);
    Social.set('mainImg', e.target.files[0]);
    const res = await confirmDialog(EditImage);
    if (res) {
      Social.uploadPostImg();
      return;
    }
    mainImg.current.value = '';
  };

  const onChoseLogo = async (e) => {
    Social.set('logo', e.target.files[0]);
    const res = await confirmDialog(EditLogo);
    if (!res) {
      logo.current.value = '';
    }
  };

  const onScrollToInvalid = useScrollToInvalid(submitBtn.current);

  useEffect(() => {
    Social.getButtons();
  }, []);

  const { errors } = useFormState();

  const NOT_UPLOADED = '0';
  const ONLY_LOGO_UPLOADED = '1';
  const ONLY_MAIN_UPLOADED = '2';

  const checkFormForErrors = () => {
    const checkStepForErrors = (stepFields) => {
      return Object.keys(stepFields).some((fieldName) => {
        return errors[fieldName];
      });
    };
    if (checkStepForErrors(stepAdCreatingIndicators, 1)) {
      Social.set('showErrors', true);
      submitBtn.current.click();
      onScrollToInvalid();
      return;
    }
    setNextStep();
  };

  return (
    <>
      <div className={styles.container}>
        <Heading level={3}>Объявление</Heading>
        <div className={styles.wrapper}>
          <div className={styles.inputRow}>
            <div className={styles.labelHolder}>
              <label htmlFor={ADCREATINGFORM.TITLE}>Заголовок</label>
            </div>

            <div className={styles.textHolder}>
              <FFTextInput
                autoTrim={false}
                keepErrorIndent={false}
                name={ADCREATINGFORM.TITLE}
                maxLength={MAX_CHARS_TITLE}
                className={styles.inputHolder}
              />
              <div className={`${styles.counter} ${styles.titleCounter}`}>{Social.getTitleCharsNumber}</div>
            </div>

            <div className={styles.tooltipHolder}>
              {
                adTitle.tooltip &&
                <Tooltip width={600}>
                  {adTitle.tooltip}
                </Tooltip>
              }
            </div>
          </div>

          <div className={`${styles.inputRow} ${styles.descriptionRow}`}>
            <div className={styles.labelHolder}>
              <label htmlFor={ADCREATINGFORM.DESCRIPTION}>Описание</label>
            </div>

            <div className={styles.textHolder}>
              <FFTextArea
                autoTrim={false}
                placeholder=""
                name={ADCREATINGFORM.DESCRIPTION}
                keepErrorIndent={false}
                maxLength={MAX_CHARS_DESCRIPTION}
                rows="2"
                className={styles.description}
              />
              <div className={`${styles.descriptionCounter} ${styles.counter}`}>{Social.getDescriptionCharsNumber}</div>
            </div>

            <div className={styles.tooltipHolder}>
              {
                adDescription.tooltip &&
                <Tooltip width={600}>
                  {adDescription.tooltip}
                </Tooltip>
              }
            </div>
          </div>

          <div className={`${styles.inputRow} ${styles.inputRowLogo}`}>
            <div className={styles.labelHolder}>
              <label>Логотип компании</label>
            </div>
            {
              Social.getLogo &&
              <div className={styles.fileDescriptionHolder}>
                <img className={styles.globalTeaserIcon} src={Social.getLogo.file_path} alt={Social.getLogo.name}/>
                <div className={styles.imgName}>{Social.getLogo.name}
                  {
                    Social.getLogoExt &&
                    <span className={styles.imgExt}> ({Social.getLogoExt}, {Social.getLogoSize})</span>
                  }
                  <div
                    className={styles.removeImgHolder}
                    onClick={() => Social.deleteLogo()}
                  >
                    <GlobalIcon slug="crossThin" />
                  </div>
                </div>
              </div> ||
              <div className={styles.textHolder}>
                <button type="button" className={styles.uploadButton} onClick={() => logo.current.click()}>Загрузить изображение</button>
                <input
                  type="file"
                  className={styles.upload}
                  accept=".jpg,.png"
                  onChange={e => onChoseLogo(e)}
                  ref={logo}
                />
                {
                  Social.showErrors && (
                    errors[ADCREATINGFORM.FILES] === NOT_UPLOADED ||
                    errors[ADCREATINGFORM.FILES] === ONLY_MAIN_UPLOADED
                  ) &&
                  <>
                    <span name={[ADCREATINGFORM.FILES]} className={styles.error}>Загрузите логотип</span>
                  </>
                }
              </div>
            }

            <div className={styles.tooltipHolder}>
              {
                adLogo.tooltip &&
                <Tooltip width={600}>
                  {adLogo.tooltip}
                </Tooltip>
              }
            </div>
          </div>

          <div className={`${styles.inputRow} ${styles.inputRowLogo}`}>
            <div className={styles.labelHolder}>
              <label>Основное изображение</label>
            </div>
            {
              Social.getTeaserImg && Social.getPostImg &&
              <div className={styles.fileDescriptionHolder}>
                <img className={styles.globalTeaserIcon} src={Social.getTeaserImg.file_path} alt={Social.getPostImg.name}/>
                <div className={styles.imgName}>{Social.getPostImg.name}
                  {
                    Social.mainImageExt &&
                    <span className={styles.imgExt}> ({Social.mainImageExt}, {Social.mainImageSize})</span>
                  }
                  <div
                    className={styles.removeImgHolder}
                    onClick={() => Social.deleteMainImg()}
                  >
                    <GlobalIcon slug="crossThin" />
                  </div>
                </div>
              </div> ||
              <div className={styles.textHolder}>
                <button type="button" className={styles.uploadButton} onClick={() => mainImg.current.click()}>Загрузить изображение</button>
                <input
                  type="file"
                  className={styles.upload}
                  accept=".jpg,.png"
                  onChange={e => onChooseMainImg(e)}
                  ref={mainImg}
                />
                {
                  Social.showErrors && (
                    errors[ADCREATINGFORM.FILES] === NOT_UPLOADED ||
                    errors[ADCREATINGFORM.FILES] === ONLY_LOGO_UPLOADED
                  ) &&
                  <>
                    <span name={[ADCREATINGFORM.FILES]} className={styles.error}>Загрузите основное изображение</span>
                  </>
                }
              </div>
            }

            <div className={styles.tooltipHolder}>
              {
                adMainImg.tooltip &&
                <Tooltip width={600}>
                  {adMainImg.tooltip}
                </Tooltip>
              }
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.labelHolder}>
              <label htmlFor={ADCREATINGFORM.BUTTONTEXT}>Текст на кнопке</label>
            </div>

            <div className={styles.buttonTextHolder}>
              <FFSelect
                options={Social.buttonsList}
                name={ADCREATINGFORM.BUTTONTEXT}
              />
            </div>

          </div>

          <div className={`${styles.inputRow} ${styles.inputRowWebsite}`}>
            <div className={styles.labelHolder}>
              <label htmlFor={ADCREATINGFORM.WEBSITE}>Ссылка на сайт</label>
            </div>

            <div className={styles.websiteInput}>
              <FFTextInput
                keepErrorIndent={false}
                name={ADCREATINGFORM.WEBSITE}
                className={styles.inputHolder}
              />
              {
                adWebsite.tooltip &&
                <Tooltip width={600}>
                  {adWebsite.tooltip}
                </Tooltip>
              }
            </div>

            <FFCheckbox
              className={styles.utmLabel}
              name={ADCREATINGFORM.UTM}
              labelClassName={styles.utmLabel}
              label="Добавить UTM-метки"
            />

          </div>

          <div className={`${styles.inputRow} ${styles.inputRowLogo}`}>
            <div className={styles.labelHolder}>
              <label>Тип устройства для показа рекламы</label>
            </div>

            <div className={styles.deviceHolder}>

              <FFCheckbox
                className={styles.deviceCheckbox}
                name={ADCREATINGFORM.MOBILE}
                labelClassName={styles.utmLabel}
                label="Мобильный"
                disabled={Social?.adStep?.desktop === false}
              />

              <FFCheckbox
                className={styles.deviceCheckbox}
                name={ADCREATINGFORM.DESKTOP}
                labelClassName={styles.utmLabel}
                label="Десктоп"
                disabled={Social?.adStep?.mobile === false}
              />

            </div>

          </div>

          <div className={`${styles.inputRow} ${styles.inputRowPreview}`}>
            <div className={styles.labelHolder}>
              <label>Предпросмотр</label>
            </div>
          </div>

          <AdPreview />
          <div className={styles.btnContainer}>
            <button type="submit" className={styles.upload} ref={submitBtn}/>
            <ActionButton
              onClick={checkFormForErrors}
              className={styles.btn}
              iconSlug="arrowRightMinimal"
            >
              Далее
            </ActionButton>
          </div>
        </div>
      </div>
    </>
  );
};

AdCreating.propTypes = {
  setNextStep: PropTypes.func,
};

export default observer(AdCreating);
