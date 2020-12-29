import React, { useEffect, useContext } from 'react';
import { useLocalStore, useObserver } from 'mobx-react';
import moment from 'moment';
import { StoresContext } from 'store/mobx';
import { axiosAuthorizedRequest, composeAxiosPostRequest } from 'requests/helpers';
import { FFTextInput, FFPhoneInput, FFCheckbox, FFRadioChipGroup } from 'components/fields';
import { OverlayLoader } from 'components/common';
import { ReplaceLoader } from 'components/common/Loaders';
import { formatPhoneProxy, normalizePhone } from 'utils/formatting';
import { FinalForm } from 'components/forms';
import { composeRequiredValidator, composePhoneValidator, composeEmailValidator } from 'utils/fieldValidators';
import GlobalIcon from 'components/common/GlobalIcon';
import { ActionButton } from 'components/buttons';
import PseudoButton from '../../components/PseudoButton';
import styles from './styles.pcss';

const WEBINAR_INFO = {
  WEBINAR_ID: 'webinarId',
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  PRIVACY_POLICY: 'privacyPolicy',
};

const ContactForm = () => {
  const { UserInfo, Templates: { getDashboardTemplate } } = useContext(StoresContext);
  const {
    title,
    name,
    email,
    phone,
    privacyPolicy,
    policyText,
    button,
  } = getDashboardTemplate('ContactForm');
  const webinarInfo = useLocalStore(() => ({
    values: {
      [WEBINAR_INFO.NAME]: '',
      [WEBINAR_INFO.EMAIL]: '',
      [WEBINAR_INFO.PHONE]: '',
      [WEBINAR_INFO.PRIVACY_POLICY]: true,
      [WEBINAR_INFO.WEBINAR_ID]: null,
    },
    loaded: false,
    hideDates: false,
    sending: false,
    error: false,
    success: false,
    webinarDates: [],
    set: (newValues) => {
      webinarInfo.values = newValues;
    },
    send: async () => {
      const data = {
        name: webinarInfo.values.name,
        email: webinarInfo.values.email,
        phone: webinarInfo.values.phone,
        webinar_id: webinarInfo.values.webinarId,
      };
      if (!webinarInfo.values[WEBINAR_INFO.PRIVACY_POLICY]) return;
      webinarInfo.sending = true;
      try {
        await composeAxiosPostRequest({
          url: '/api/v1/client/webinars/register/',
          data,
        });
        webinarInfo.success = true;
      } catch (e) {
        webinarInfo.error = true;
      } finally {
        webinarInfo.sending = false;
      }
    },
    getDates: async () => {
      try {
        const request = await axiosAuthorizedRequest({ url: '/api/v1/client/webinars/schedule/' });
        request.forEach(webinar => {
          const utcDate = new Date(`${webinar.start_time.split(' ').join('T')}+00:00`);
          webinarInfo.webinarDates.push({
            label: moment(utcDate).utcOffset(3).format('DD MMMM hh:mm (мск)'),
            value: webinar.id,
          });
        });
        webinarInfo.values.webinarId = request[0].id;
      } catch (e) {
        webinarInfo.hideDates = true;
      }
    },
  }));

  useEffect(() => {
    const request = async () => {
      await webinarInfo.getDates();
      await UserInfo.getUser();
      webinarInfo.values.name = `${UserInfo.data.first_name} ${UserInfo.data.middle_name}`;
      webinarInfo.values.phone = UserInfo.data.phone;
      webinarInfo.values.email = UserInfo.data.email;
      webinarInfo.loaded = true;
    };
    request();
  }, []);

  const getValidators = () => ({
    name: [composeRequiredValidator('Поле обязательное для заполнения')],
    phone: [
      composeRequiredValidator('Обязательное поле'),
      composePhoneValidator('Номер телефона должен быть заполнен в формате 9XXXXXXXXX'),
    ],
    email: [
      composeEmailValidator('Email должен быть заполнен в формате XXXX@XXX.XX'),
      composeRequiredValidator('Обязательное поле'),
    ],
  });

  return useObserver(() => (
    <ReplaceLoader isLoading={!webinarInfo.loaded}>
      <OverlayLoader isLoading={webinarInfo.sending}>
        <div className={styles.container}>

          <div className={styles.title}>{title}</div>

          <FinalForm
            onSubmit={webinarInfo.send}
            onChange={(newValues) => { webinarInfo.set(newValues); }}
            values={webinarInfo.values}
            getValidators={getValidators}
          >
            {
              !webinarInfo.hideDates &&
              <FFRadioChipGroup
                defaultValue={webinarInfo.values.webinarId}
                options={webinarInfo.webinarDates.slice()}
                name={WEBINAR_INFO.WEBINAR_ID}
              />
            }

            <div className={styles.inputsContainer}>

              <FFTextInput
                placeholder={name}
                keepErrorIndent={false}
                name={WEBINAR_INFO.NAME}
                className={styles.inputRow}
              />
              <FFTextInput
                placeholder={email}
                keepErrorIndent={false}
                name={WEBINAR_INFO.EMAIL}
                className={styles.inputRow}
              />
              <FFPhoneInput
                placeholder={phone}
                keepErrorIndent={false}
                name={WEBINAR_INFO.PHONE}
                valueProxy={formatPhoneProxy}
                onChangeProxy={normalizePhone}
              />

            </div>

            <div className={styles.privacyPolicyWrapper}>

              <FFCheckbox
                name={WEBINAR_INFO.PRIVACY_POLICY}
              />
              <a
                className={styles.privacyPolicy}
                rel="noreferrer"
                target="_blank"
                href={privacyPolicy}
              >
                {policyText}
              </a>
              <GlobalIcon slug="externalLink" className={styles.icon} />

            </div>

            {
              !webinarInfo.success &&
              <ActionButton
                type="submit"
                iconSlug="arrowRightMinimal"
                className={styles.button}
                isDisabled={!webinarInfo.values.privacyPolicy}
              >
                {button}
              </ActionButton>
            }

            {
              webinarInfo.success &&
              <PseudoButton>Ваша заявка принята</PseudoButton>
            }

            {
              webinarInfo.error &&
              <div className={styles.error}>Что-то пошло не так, попробуйте ещё раз позднее</div>
            }
          </FinalForm>

        </div>
      </OverlayLoader>
    </ReplaceLoader>
  ) || null);
};

export default ContactForm;
