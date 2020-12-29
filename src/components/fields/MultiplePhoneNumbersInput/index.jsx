import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
// import { observer } from 'mobx-react';
import withFieldArray from 'enhancers/withFieldArray';
import { PhoneInput } from 'components/fields/TextInput';
import { checkNumber } from 'requests/common';
import { wordFormByCount } from 'utils/fn';

import AddNumberButton from '../_parts/AddNumberButton';
import MultiplePhoneTabs from '../_parts/MultiplePhoneTabs';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const isNumberExists = (phonesList, phone) => phonesList.value && phonesList.value.some(val => val.toString() === phone.toString());

const MultiplePhoneNumbersInput = ({
  error: finalFieldError,
  fields: list,
  isShowError,
  maxCount,
  name,
  buttonIcon,
  buttonText,
  onChangeHandler,
}) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState();
  useEffect(() => {
    onChangeHandler && onChangeHandler();
  }, [list.length]);
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

    if (phone[0] !== '9') {
      setError('Номер телефона должен быть заполнен в формате +7 9XXXXXXXXX');
      return;
    }

    const response = await checkNumber(phone);
    if (response.is_beeline === false) {
      setError(response.message);
      return;
    }

    list.push(response.ctn);
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
    <Fragment>
      <MultiplePhoneTabs phonesList={list} />

      <div className={cx('inputContainer')}>
        <PhoneInput
          className={cx('phoneInput')}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={error || finalFieldError || isShowError}
          name={name}
          value={phone}
        />

        <AddNumberButton icon={buttonIcon} onClick={handleClick} >{buttonText}</AddNumberButton>
      </div>
    </Fragment>
  );
};

MultiplePhoneNumbersInput.propTypes = {
  error: PropTypes.string,
  name: PropTypes.string,
  buttonIcon: PropTypes.string,
  buttonText: PropTypes.string,
  maxCount: PropTypes.number,
  fields: PropTypes.shape({}),
  onChangeHandler: PropTypes.any,
  isShowError: PropTypes.any,
};

export default withFieldArray(MultiplePhoneNumbersInput);
