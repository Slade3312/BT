import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { wordFormByCount } from 'utils/fn';
import { StoresContext } from 'store/mobx';
import FormFieldLabel from 'components/forms/FormFieldLabel';
import commonStyles from 'styles/common.pcss';
import Heading from 'components/layouts/Heading';
import MultiplePhoneTabs from 'components/fields/_parts/MultiplePhoneTabs';
import { PhoneInput } from 'components/fields/TextInput';
import AddNumberButton from 'components/fields/_parts/AddNumberButton';
import withFieldArray from 'enhancers/withFieldArray';
import withFinalField from 'enhancers/withFinalField';

import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

function ManuallyAddedNumbers({
  error: finalFieldError,
  fields: list,
  onChangeHandler,
  name,
}) {
  const {
    Templates: { getNewCampaignTemplate },
    WebsAndPhonesTaxons,
  } = useContext(StoresContext);

  const {
    manuallyNumberslabel,
    manuallyNumbersButtonText,
    manuallyNumbersButtonIcon,
    maxCount,
    minCount,
  } = getNewCampaignTemplate('PhoneNumbersTaxon');

  const numbersSpelling = ['номер', 'номера', 'номеров'];
  const phoneSpelling = ['телефон', 'телефона', 'телефонов'];

  const [phone, setPhone] = useState('');
  const [error, setError] = useState();

  useEffect(() => onChangeHandler && onChangeHandler(), [list.length]);

  const isNumberExists = (phonesList, phoneNumber) => {
    return phonesList.value && phonesList.value.some(val => val === `+7${phoneNumber}`);
  };

  const handleChange = (value) => {
    setPhone(value);
    setError('');
  };

  const addNumber = async () => {
    if (!phone.length) {
      setError('Введите номер телефона');
      return;
    }

    if (list.length >= maxCount) {
      setError(`Максимум ${maxCount} ${wordFormByCount(maxCount, ['номер', 'номера', 'номеров'])}`);
      return;
    }

    if (isNumberExists(list, phone)) {
      setError('Этот номер уже добавлен');
      return;
    }

    if (phone.length !== 10) {
      setError('Не валидный номер');
      return;
    }

    list.push(`+7${phone}`);

    setError('');
    setPhone('');
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      addNumber();
    }
  };

  const handleClick = () => {
    addNumber();
  };

  return (
    <div>
      <div className={cx('label-group-marg', 'mart-m', 'labelContainer')}>
        <FormFieldLabel isBold>
          {manuallyNumberslabel}
        </FormFieldLabel>

        <Heading
          level={5}
          className={cx('countLeft', { isError: WebsAndPhonesTaxons.phoneNumbersTaxonCountLeft(+maxCount) === 0 })}
        >
          Осталось {WebsAndPhonesTaxons.phoneNumbersTaxonCountLeft(+maxCount)} {wordFormByCount(WebsAndPhonesTaxons.phoneNumbersTaxonCountLeft(+maxCount), numbersSpelling)}
        </Heading>
      </div>

      <div className={cx('inputContainer')}>
        <PhoneInput
          className={cx('phoneInput')}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={
            error ||
            finalFieldError ||
            ((WebsAndPhonesTaxons.checkForPhoneNumbersMinValidation && WebsAndPhonesTaxons.isShowMinPhoneNumbersError) || WebsAndPhonesTaxons.phoneNumbersTaxonCountLeftNegative < 0)
          }
          name={name}
          value={phone}
        />

        <AddNumberButton icon={manuallyNumbersButtonIcon} onClick={handleClick}>
          {manuallyNumbersButtonText}
        </AddNumberButton>
      </div>

      <MultiplePhoneTabs phonesList={list} />

      {(WebsAndPhonesTaxons.checkForPhoneNumbersMinValidation && WebsAndPhonesTaxons.isShowMinPhoneNumbersError) &&
        <div className={styles.error}>
          Для подбора аудитории необходимо указать минимум {+minCount} {wordFormByCount(+minCount, numbersSpelling)} {wordFormByCount(+minCount, phoneSpelling)}.
        </div>
      }
    </div>
  );
}

ManuallyAddedNumbers.propTypes = {
  error: PropTypes.string,
  fields: PropTypes.object,
  onChangeHandler: PropTypes.func,
  name: PropTypes.string,
};

export default withFinalField(withFieldArray(ManuallyAddedNumbers));
