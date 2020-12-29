import React, { useRef } from 'react';
import classNames from 'classnames/bind';
import { useLocalStore, useObserver } from 'mobx-react';
import { axiosAuthorizedRequest } from 'requests/helpers';
import Templates from 'store/mobx/Templates';
import commonStyles from 'styles/common.pcss';
import { Heading } from 'components/layouts';
import { FFTextInput, FFCheckbox } from 'components/fields';
import { PopupStateless, OverlayLoader } from 'components/common';
import { FinalForm } from 'components/forms';
import {
  composeRequiredValidator,
  composeRangeValidator,
  composeUserInitialsValidator,
  composeEmailValidator,
} from 'utils/fieldValidators';
import { ActionButton } from 'components/buttons';
import UserInfo from 'store/mobx/UserInfo';

import InfoMessageModal from '../InfoMessageModal';
import UploadDocs from './containers/UploadDocs';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

const CONFIRM = {
  INN: 'inn',
  COMPANY: 'company',
  NAME: 'name',
  LAST_NAME: 'last_name',
  MIDDLE_NAME: 'middle_name',
  PRIVACY_POLICY: 'privacy_policy',
  EMAIL: 'email',
  SELFIMPLOYED: 'self_employed',
};

const ConfirmInn = ({ giveAnswer, disableClose }) => {
  const uploadBtn = useRef();
  const lastInn = useRef('');
  const { getConfirmInnTemplate } = Templates;
  const confirmation = useLocalStore(() => ({
    values: {
      [CONFIRM.INN]: '',
      [CONFIRM.COMPANY]: '',
      [CONFIRM.LAST_NAME]: UserInfo?.data?.last_name || '',
      [CONFIRM.MIDDLE_NAME]: UserInfo?.data?.middle_name || '',
      [CONFIRM.NAME]: UserInfo?.data?.first_name || '',
      [CONFIRM.EMAIL]: UserInfo.data.email,
      [CONFIRM.PRIVACY_POLICY]: true,
    },
    isDocsNeeded: null,
    innNotValid: false,
    lastRequestTime: null,
    isInnChecked: false,
    errorOnConfirm: false,
    sendingData: false,
    loading: false,
    files: [],
    errorFilesText: null,
    errorText: null,
    get submitShouldBeDisabled() {
      if (confirmation.isDocsNeeded === true) {
        return !confirmation.values[CONFIRM.PRIVACY_POLICY] ||
              confirmation.files.length < 1;
      }
      return !confirmation.values[CONFIRM.PRIVACY_POLICY];
    },
    uploadFiles: files => {
      confirmation.errorFilesText = null;
      Array.prototype.forEach.call(files, (file) => {
        if (
          (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf') &&
          confirmation.files.length < 5
        ) {
          confirmation.files.push({
            file,
          });
        } else if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'application/pdf') {
          confirmation.errorFilesText = 'Допустимые типы файлов: .jpg, .png, .pdf';
        }
      });
    },
    checkForExistingInn: async () => {
      confirmation.errorText = null;
      confirmation.innNotValid = false;
      const time = Date.now();
      confirmation.lastRequestTime = time;
      if (
        confirmation.values[CONFIRM.INN].length !== 10 &&
        confirmation.values[CONFIRM.INN].length !== 12
      ) {
        return;
      }
      confirmation.loading = true;
      try {
        const isExist = await axiosAuthorizedRequest({
          url: `/api/v1/user-info/${UserInfo.data.id}/check-inn/`,
          method: 'POST',
          data: {
            inn: confirmation.values[CONFIRM.INN],
            [CONFIRM.SELFIMPLOYED]: false,
          },
        });
        confirmation.isDocsNeeded = isExist.docs_needed;
      } catch (e) {
        if (time === confirmation.lastRequestTime) {
          confirmation.innNotValid = true;
          confirmation.errorText = e.response.data.readable_error || 'Указанный ИНН не существует';
        }
      } finally {
        if (time === confirmation.lastRequestTime) {
          confirmation.isInnChecked = true;
        }
        confirmation.loading = false;
      }
    },
    sendData: async () => {
      try {
        confirmation.loading = true;
        const fileIds = await Promise.all(confirmation.files.map(item => {
          const formData = new FormData();
          formData.append('file', item.file);
          return axiosAuthorizedRequest({
            url: '/api/v1/client/company_docs/',
            method: 'POST',
            data: formData,
          }).then(res => res.id);
        }));
        await axiosAuthorizedRequest({
          url: `/api/v1/user-info/${UserInfo.data.id}/account-update/`,
          method: 'POST',
          data: {
            name: confirmation.values[CONFIRM.NAME],
            inn: confirmation.values[CONFIRM.INN],
            last_name: confirmation.values[CONFIRM.LAST_NAME],
            first_name: confirmation.values[CONFIRM.NAME],
            middle_name: confirmation.values[CONFIRM.MIDDLE_NAME],
            email: confirmation.values[CONFIRM.EMAIL],
            files: fileIds,
            verification_consent: confirmation.values[CONFIRM.PRIVACY_POLICY],
            [CONFIRM.SELFIMPLOYED]: false,
          },
        });

        giveAnswer(true);
      } catch (e) {
        confirmation.errorOnConfirm = true;
      } finally {
        confirmation.loading = false;
      }
    },
  }));

  const getValidators = () => ({
    [CONFIRM.INN]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
      () => {
        if (confirmation.innNotValid) {
          return confirmation.errorText;
        }
        return undefined;
      },
      composeRangeValidator({
        typeMessage: 'Проверьте корректность ИНН',
        sizeMessage: 'Длина ИНН 10 или 12 цифр',
      }, { min: 10, max: 12 }),
    ],
    [CONFIRM.COMPANY]: [composeRequiredValidator('Поле обязательное для заполнения')],
    [CONFIRM.NAME]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
      composeUserInitialsValidator(`Имя может содержать только символы кириллицы,
      а также пробелы, знак ' и тире`),
    ],
    [CONFIRM.LAST_NAME]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
      composeUserInitialsValidator(`Фамилия может содержать только символы кириллицы,
      а также пробелы, знак ' и тире`),
    ],
    [CONFIRM.EMAIL]: !UserInfo.data.email ? [
      composeRequiredValidator('Поле обязательное для заполнения'),
      composeEmailValidator('Email должен быть заполнен в формате XXXX@XXX.XX'),
    ] : false,
  });
  return useObserver(() => (
    <PopupStateless
      opened
      onClose={() => {
        !disableClose && giveAnswer(false);
      }}
      hideCloseButton={disableClose}
    >
      <OverlayLoader isLoading={confirmation.loading}>
        {
          !confirmation.errorOnConfirm &&
            <div className={cx('content')}>
              <Heading level={2} className={cx('title', 'marb-m')}>{getConfirmInnTemplate('title')}</Heading>

              <p className={cx('description')}>{getConfirmInnTemplate('description')}</p>

              <FinalForm
                onSubmit={confirmation.sendData}
                onChange={(newValues) => {
                  confirmation.values = newValues;
                  if (newValues.inn !== lastInn.current) {
                    confirmation.checkForExistingInn();
                  }
                  lastInn.current = newValues.inn;
                }}
                values={confirmation.values}
                getValidators={getValidators}
              >
                <div className={cx('inputsHolder')}>

                  <div className={cx('inputRow')}>
                    <div className={styles.labelHolder}>
                      <label htmlFor={CONFIRM.COMPANY}>{getConfirmInnTemplate('inn')}</label>
                    </div>

                    <FFTextInput
                      size="long"
                      keepErrorIndent={false}
                      maxLength="12"
                      name={CONFIRM.INN}
                      className={cx('inputHolder')}
                  />
                  </div>

                  <div className={cx('inputRow')}>
                    <div className={styles.labelHolder}>
                      <label htmlFor={CONFIRM.COMPANY}>{getConfirmInnTemplate('company')}:</label>
                    </div>

                    <FFTextInput
                      size="long"
                      keepErrorIndent={false}
                      id={CONFIRM.COMPANY}
                      name={CONFIRM.COMPANY}
                      className={cx('inputHolder')}
                    />
                  </div>

                  <div className={cx('inputRow')}>

                    <div className={styles.labelHolder}>
                      <label htmlFor={CONFIRM.LAST_NAME}>{getConfirmInnTemplate('lastName')}</label>
                    </div>

                    <FFTextInput
                      size="long"
                      keepErrorIndent={false}
                      name={CONFIRM.LAST_NAME}
                      className={cx('inputHolder')}
                    />

                  </div>

                  <div className={cx('inputRow')}>
                    <div className={styles.labelHolder}>
                      <label htmlFor={CONFIRM.NAME}>{getConfirmInnTemplate('name')}</label>
                    </div>

                    <FFTextInput
                      size="long"
                      keepErrorIndent={false}
                      name={CONFIRM.NAME}
                      className={cx('inputHolder')}
                    />
                  </div>

                  <div className={cx('inputRow')}>
                    <div className={styles.labelHolder}>
                      <label htmlFor={CONFIRM.MIDDLE_NAME}>{getConfirmInnTemplate('middleName')}</label>
                    </div>

                    <FFTextInput
                      size="long"
                      keepErrorIndent={false}
                      name={CONFIRM.MIDDLE_NAME}
                      className={cx('inputHolder')}
                    />
                  </div>

                  {!UserInfo.data.email && (
                    <div className={cx('inputRow')}>
                      <div className={styles.labelHolder}>
                        <label htmlFor={CONFIRM.LAST_NAME}>{getConfirmInnTemplate('email')}</label>
                      </div>

                      <FFTextInput
                        size="long"
                        keepErrorIndent={false}
                        name={CONFIRM.EMAIL}
                        className={cx('inputHolder')}
                      />
                    </div>
                  )}
                  {
                    confirmation.isDocsNeeded && confirmation.isInnChecked &&
                    <UploadDocs confirmation={confirmation} ref={uploadBtn} />
                  }

                  <div className={cx('privacyPolicyRow')}>
                    <FFCheckbox
                      name={CONFIRM.PRIVACY_POLICY}
                    />

                    <a
                      className={styles.privacyPolicy}
                      rel="noreferrer"
                      target="_blank"
                      href="https://static.beeline.ru/upload/images/business/2019-10-15_Soglasie.pdf"
                    >
                      {getConfirmInnTemplate('privacyPolicy')}
                    </a>

                  </div>

                  <div className={cx('buttonsContainer')}>
                    <ActionButton
                      type="submit"
                      className={cx('button', 'confirmButton')}
                      iconSlug="arrowRightMinimal"
                      isDisabled={confirmation.submitShouldBeDisabled}
                    >
                      {getConfirmInnTemplate('button')}
                    </ActionButton>
                  </div>

                </div>
              </FinalForm>
            </div>
        }

        {
          confirmation.errorOnConfirm &&
          <InfoMessageModal
            imageSrc={getConfirmInnTemplate('errorImg')}
            title={getConfirmInnTemplate('errorTitle')}
            description={getConfirmInnTemplate('errorDescription')}
            buttonText={getConfirmInnTemplate('errorButton')}
            buttonClass={cx('button')}
            onClose={() => giveAnswer(false)}
        />
        }
      </OverlayLoader>
    </PopupStateless>
  ));
};

export default ConfirmInn;
