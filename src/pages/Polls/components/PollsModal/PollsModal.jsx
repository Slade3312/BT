import React, { useContext } from 'react';
import { navigate } from '@reach/router';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { formatPrice } from 'utils/formatting';

import { ActionButton } from 'components/buttons';
import { Heading } from 'components/layouts';
import { PopupStateless, OverlayLoader } from 'components/common';
import { FFTextArea, FFTextInput, FFPriceInput } from 'components/fields';
import { TextInput } from 'components/fields/TextInput';
import ThumpUp from 'components/common/GlobalIcon/assets/thumpUp.svg';
import Sad from 'components/common/GlobalIcon/assets/sad.svg';
import { useOnBlurBlockFieldsGA } from 'utils/ga-analytics/hooks';
import NotificationPopup from 'pages/NewCampaign/components/NotificationPopup/index';
import { FORM_FIELDS } from 'store/mobx/Polls';
import { FinalForm } from 'components/forms';
import { composeRequiredValidator, composeNumberValidator, composePromoValidator } from 'utils/fieldValidators';


import styles from './styles.pcss';

const PollsModal = () => {
  const { Polls, Templates, Common } = useContext(StoresContext);
  const { checkPollsPromocode, setPromocode } = Polls;
  const {
    isModalOpened,
    isSuccessModalOpened,
    isFailModalOpened,
    comment,
    isLoading,
    promoCodeValue,
    shouldValidatePromo,
  } = Polls.modal;
  const modal = Templates.getPollsTemplate('PollsModal');
  const { secondTitle } = Templates.getPollsTemplate('MainBanner');
  const successModal = Templates.getPollsTemplate('PollsSuccessModal');
  const failModal = Templates.getPollsTemplate('PollsFailModal');

  const handleBlurGA = useOnBlurBlockFieldsGA({ blockName: secondTitle, event: 'event_b2b_quiz', action: 'change_field_question' });

  const textPromocode = Polls.modal.fields[FORM_FIELDS.PROMOCODE];

  const handleFormChange = (values) => {
    Polls.setModalFields(values);
    Polls.setModal('promoCodeModalFailed', '');
  };

  const handleBlurQuestion = (event) => {
    handleBlurGA(event);
  };

  const handleClose = () => {
    Polls.resetModalData();
  };

  const handleSuccessModalClose = () => {
    navigate('/');
    handleClose();
  };

  const getValidators = () => ({
    [FORM_FIELDS.QUESTION]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
    ],
    [FORM_FIELDS.GEOGRAPHY]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
    ],
    [FORM_FIELDS.PROFILE]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
    ],
    [FORM_FIELDS.BUDGET]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
      composeNumberValidator(`Сумма не может быть ниже ${formatPrice(Common?.constants?.MIN_POLL_BUDGET)} ₽`, { min: Common?.constants?.MIN_POLL_BUDGET }),
    ],
    [FORM_FIELDS.PROMOCODE]: [
      composePromoValidator(promoCodeValue),
    ],
  });

  return (
    <>
      <PopupStateless opened={isModalOpened} onClose={handleClose} className={styles.popup}>
        <OverlayLoader isLoading={isLoading}>
          <Heading level={1} className={styles.title}>
            {modal.title}
          </Heading>

          <div className={styles.content}>
            <Heading level={4} className={styles.description}>
              {modal.description}
            </Heading>

            <FinalForm
              onSubmit={Polls.handleSendPoll}
              onChange={handleFormChange}
              values={Polls.modal.fields}
              getValidators={getValidators}
            >
              <div className={styles.inputRow}>
                <label className={styles.label} htmlFor={FORM_FIELDS.QUESTION}>
                  Цель опроса:
                </label>

                <FFTextArea
                  className={styles.textArea}
                  value={comment}
                  placeholder={modal.placeholder}
                  name={FORM_FIELDS.QUESTION}
                  onBlur={handleBlurQuestion}
                />
              </div>

              <div className={styles.inputRow}>
                <label className={styles.label} htmlFor={FORM_FIELDS.GEOGRAPHY}>
                  География опроса:
                </label>

                <FFTextInput
                  keepErrorIndent={false}
                  name={FORM_FIELDS.GEOGRAPHY}
                  className={styles.input}
                  placeholder="Например: Москва, Московская область"
                />
              </div>

              <div className={styles.inputRow}>
                <label className={styles.label} htmlFor={FORM_FIELDS.PROFILE}>
                  Профиль потребителя:
                </label>

                <FFTextArea
                  keepErrorIndent={false}
                  name={FORM_FIELDS.PROFILE}
                  className={styles.textArea}
                  placeholder="Например: мужчины, 25-55 лет, доход средний, интересуется футболом, делает ставки"
                />
              </div>

              <div className={styles.inputRow}>
                <label className={styles.label} htmlFor={FORM_FIELDS.BUDGET}>
                  Планируемый бюджет:
                </label>

                <FFPriceInput
                  maxLength={10}
                  keepErrorIndent={false}
                  name={FORM_FIELDS.BUDGET}
                  className={styles.input}
                  placeholder={`от ${Common?.constants?.MIN_POLL_BUDGET} рублей с НДС`}
                />
              </div>

              <div className={styles.inputRowPromo}>
                <label className={styles.labelPromo} htmlFor={FORM_FIELDS.PROMOCODE}>
                  Промокод:
                </label>
                <TextInput
                  error={shouldValidatePromo && (Polls.promocodeError || Polls.promocodeSuggest)}
                  value={Polls.modal.fields[FORM_FIELDS.PROMOCODE]}
                  onChange={setPromocode}
                  keepErrorIndent={false}
                  disabled={isLoading}
                  className={styles.promoInput}
                />
                {
                  promoCodeValue &&
                  <div className={styles.promoApplied}>Промокод {Polls.modal.fields[FORM_FIELDS.PROMOCODE]} был успешно применён!</div>
                }
                <ActionButton isDisabled={!Polls.modal.fields[FORM_FIELDS.PROMOCODE]} type="button" className={styles.buttonPromo} onClick={checkPollsPromocode}>
                  Применить
                </ActionButton>
              </div>
              {
                promoCodeValue &&
                <>
                  <div className={styles.totalWrapper}>
                    <div className={styles.totalTitle}>Бюджет опроса<span className={styles.withoutTaxes}> (c НДС)</span>: <span className={styles.oldPrice}>{formatPrice(Polls.modal.fields[FORM_FIELDS.BUDGET])} ₽</span> {formatPrice(Polls.getPromoPrice)} ₽</div>
                  </div>
                </>
              }

              <ActionButton isDisabled={textPromocode && !promoCodeValue} type="submit" className={styles.button}>
                {modal.button}
              </ActionButton>
            </FinalForm>
          </div>
        </OverlayLoader>
      </PopupStateless>

      <NotificationPopup
        emoji={<ThumpUp />}
        title={successModal.title}
        description={successModal.description}
        buttonText={successModal.button}
        onButtonClick={handleSuccessModalClose}
        isOpen={isSuccessModalOpened}
        onClose={handleClose}
      />

      <NotificationPopup
        emoji={<Sad />}
        title={failModal.title}
        description={failModal.description}
        buttonText={failModal.button}
        onButtonClick={handleClose}
        isOpen={isFailModalOpened}
        onClose={handleClose}
      />
    </>
  );
};

export default observer(PollsModal);
