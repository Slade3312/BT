import React, { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useLocalStore, useObserver, observer } from 'mobx-react';
import { axiosAuthorizedRequest } from 'requests/helpers';
import Templates from 'store/mobx/Templates';
import Common from 'store/mobx/Common';
import commonStyles from 'styles/common.pcss';
import { Heading } from 'components/layouts';
import { PopupStateless, OverlayLoader } from 'components/common';
import { FinalForm } from 'components/forms';
import {
  composeRequiredValidator,
  composeRangeValidator,
  composeUserInitialsValidator,
  composeEmailValidator,
  docsNumberValidator,
} from 'utils/fieldValidators';
import { ActionButton } from 'components/buttons';
import UserInfo from 'store/mobx/UserInfo';

import InfoMessageModal from '../InfoMessageModal';

import styles from './styles.pcss';
import Inn from './containers/Inn';
import LastName from './containers/LastName';
import Name from './containers/Name';
import MiddleName from './containers/MiddleName';
import Email from './containers/Email';
import DocType from './containers/DocType';
import SerialNumber from './containers/SerialNumber';
import IssuedByWhom from './containers/IssuedByWhom';
import PrivacyPolicy from './containers/PrivacyPolicy';
import UploadDocs from './containers/UploadDocs';

const cx = classNames.bind({ ...commonStyles, ...styles });

export const CONFIRM = {
  INN: 'inn',
  NAME: 'name',
  LAST_NAME: 'last_name',
  MIDDLE_NAME: 'middle_name',
  PRIVACY_POLICY: 'privacy_policy',
  EMAIL: 'email',
  DOCTYPE: 'doc_type',
  SERIALDOC: 'doc_serial',
  NUMBERDOC: 'doc_number',
  ISSUEDBY: 'issued_by_whom',
  SELFIMPLOYED: 'self_employed',
};

const PASSPORT = 'Паспорт РФ';

const ConfirmInnPrivate = ({ giveAnswer, disableClose }) => {
  const uploadBtn = useRef();
  const lastInn = useRef('');
  const { getConfirmInnPrivateTemplate } = Templates;
  const confirmation = useLocalStore(() => ({
    values: {
      [CONFIRM.INN]: '',
      [CONFIRM.LAST_NAME]: UserInfo?.data?.last_name || '',
      [CONFIRM.MIDDLE_NAME]: UserInfo?.data?.middle_name || '',
      [CONFIRM.NAME]: UserInfo?.data?.first_name || '',
      [CONFIRM.EMAIL]: UserInfo.data.email,
      [CONFIRM.PRIVACY_POLICY]: true,
      [CONFIRM.DOCTYPE]: PASSPORT,
      [CONFIRM.SERIALDOC]: '',
      [CONFIRM.NUMBERDOC]: '',
      [CONFIRM.ISSUEDBY]: '',
    },
    errorText: null,
    errorFilesText: null,
    isDocsNeeded: null,
    innNotValid: false,
    isInnChecked: false,
    errorOnConfirm: false,
    sendingData: false,
    loading: false,
    files: [],

    get submitShouldBeDisabled() {
      return !confirmation.values[CONFIRM.PRIVACY_POLICY] ||
              confirmation.files.length < 1;
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
      confirmation.innNotValid = false;
      confirmation.errorText = null;
      if (
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
            [CONFIRM.SELFIMPLOYED]: true,
          },
        });
        confirmation.isDocsNeeded = isExist.docs_needed;
      } catch (e) {
        confirmation.innNotValid = true;
        confirmation.errorText = e.response.data.readable_error || 'Указанный ИНН не существует';
      } finally {
        confirmation.loading = false;
        confirmation.isInnChecked = true;
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
            [CONFIRM.NAME]: confirmation.values[CONFIRM.NAME],
            [CONFIRM.INN]: confirmation.values[CONFIRM.INN],
            [CONFIRM.LAST_NAME]: confirmation.values[CONFIRM.LAST_NAME],
            first_name: confirmation.values[CONFIRM.NAME],
            [CONFIRM.MIDDLE_NAME]: confirmation.values[CONFIRM.MIDDLE_NAME],
            [CONFIRM.EMAIL]: confirmation.values[CONFIRM.EMAIL],
            files: fileIds,
            verification_consent: confirmation.values[CONFIRM.PRIVACY_POLICY],
            [CONFIRM.SELFIMPLOYED]: true,
            [CONFIRM.SERIALDOC]: confirmation.values[CONFIRM.SERIALDOC],
            [CONFIRM.NUMBERDOC]: confirmation.values[CONFIRM.NUMBERDOC],
            [CONFIRM.ISSUEDBY]: confirmation.values[CONFIRM.ISSUEDBY],
            [CONFIRM.DOCTYPE]: confirmation.values[CONFIRM.DOCTYPE],
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

  useEffect(() => {
    Common.getDocTypes();
  }, []);

  useEffect(() => {
    if (Common.docTypesList.length) {
      confirmation.loading = false;
      confirmation.values[CONFIRM.DOCTYPE] = Common.docTypesList[0].value;
      return;
    }
    confirmation.loading = true;
  }, [Common.docTypesList.length]);

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
        sizeMessage: 'Длина ИНН 12 цифр',
      }, { min: 12, max: 12 }),
    ],
    [CONFIRM.NAME]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
      composeUserInitialsValidator(`Имя может содержать только символы кириллицы,
      а также пробелы, знак ' и тире`),
    ],
    [CONFIRM.MIDDLE_NAME]: [
      composeUserInitialsValidator(`Отчество может содержать только символы кириллицы,
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
    [CONFIRM.SERIALDOC]: [
      confirmation.values[CONFIRM.DOCTYPE] === PASSPORT &&
      docsNumberValidator({
        typeMessage: 'Только цифры',
        sizeMessage: '4 цифры',
      }, { min: 4, max: 4 }) ||
      docsNumberValidator({
        typeMessage: 'Только цифры',
        sizeMessage: 'до 15 цифр',
      }, { min: 1, max: 15 }),
      composeRequiredValidator('Обязательное поле'),
    ],
    [CONFIRM.NUMBERDOC]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
      confirmation.values[CONFIRM.DOCTYPE] === PASSPORT &&
      docsNumberValidator({
        typeMessage: 'Только цифры',
        sizeMessage: '6 цифр',
      }, { min: 6, max: 6 }) ||
      docsNumberValidator({
        typeMessage: 'Только цифры',
        sizeMessage: 'до 80 цифр',
      }, { min: 1, max: 80 }),
    ],
    [CONFIRM.ISSUEDBY]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
    ],
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
              <Heading level={2} className={cx('title', 'marb-m')}>{getConfirmInnPrivateTemplate('title')}</Heading>
              <p className={cx('description')}>{getConfirmInnPrivateTemplate('description')}</p>
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

                  <Inn />
                  <LastName />
                  <Name />
                  <MiddleName />
                  {!UserInfo.data.email && (
                    <Email/>
                  )}

                  <DocType confirmation={confirmation} />
                  <SerialNumber />
                  <IssuedByWhom />
                </div>
                <UploadDocs confirmation={confirmation} ref={uploadBtn} />
                <PrivacyPolicy />

                <div className={cx('buttonsContainer')}>
                  <ActionButton
                    type="submit"
                    className={cx('button', 'confirmButton')}
                    iconSlug="arrowRightMinimal"
                    isDisabled={confirmation.submitShouldBeDisabled}
                  >
                    { getConfirmInnPrivateTemplate('button') }
                  </ActionButton>
                </div>

              </FinalForm>
            </div>
        }

        {
          confirmation.errorOnConfirm &&
          <InfoMessageModal
            imageSrc={getConfirmInnPrivateTemplate('errorImg')}
            title={getConfirmInnPrivateTemplate('errorTitle')}
            description={getConfirmInnPrivateTemplate('errorDescription')}
            buttonText={getConfirmInnPrivateTemplate('errorButton')}
            buttonClass={cx('button')}
            onClose={() => giveAnswer(false)}
        />
        }
      </OverlayLoader>
    </PopupStateless>
  ));
};

export default observer(ConfirmInnPrivate);
