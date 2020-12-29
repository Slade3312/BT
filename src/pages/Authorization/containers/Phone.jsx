import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import { ActionButton } from 'components/buttons/ActionButtons';
import Authorization from 'store/mobx/Authorization';
import { Close, Logo } from '../assets';
import styles from './styles.pcss';

// eslint-disable-next-line
Object.defineProperty(Array.prototype, 'spliceIfExist', {
  // eslint-disable-next-line
  value: function(index, replaceIndex, value){
    if (this?.length >= index) {
      this.splice(index, replaceIndex, value);
    }
    return this;
  },
});

const Phone = () => {
  const {
    setPhone,
    isErrorPhone,
    resetError,
    checkIsPhoneCorrect,
    phone,
    setErrorPhone,
  } = Authorization;
  const [isLoading, setLoading] = useState(false);
  const onSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (!checkIsPhoneCorrect) {
        setErrorPhone(true);
        return;
      }
      await Authorization.phoneConfirmation({ phone: phone.replace(/\D/g, '') });
      Authorization.setScreen('sms');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const input = useRef();

  useEffect(() => {
    input.current.focus();
  }, []);

  const getInputStyles = (isPhoneInputed, isErrorOccured) => {
    if (isPhoneInputed && !isErrorOccured) {
      return `${styles.phoneInput} ${styles.pnoneInputed}`;
    } else if (isPhoneInputed && isErrorOccured) {
      return `${styles.phoneInput} ${styles.errorText} ${styles.errorInput}`;
    }
    return styles.phoneInput;
  };

  const [keyCode, setKeyCode] = useState(null);

  const setNumberMask = (value) => {
    if (value.length === 1 && value === '+') {
      value = '7';
    }
    const cleanedNumber = value.replace(/\D/g, '');
    const cleanedNumberArray = cleanedNumber.split('');
    if (cleanedNumberArray.length === 12) return cleanedNumberArray.splice(12, 1, '');
    switch (cleanedNumberArray[0]) {
      case '8':
      case '7':
        cleanedNumberArray[0] = '+7';
        break;
      case '9':
        cleanedNumberArray.unshift('+7');
        break;
      default:
        break;
    }
    cleanedNumberArray
      .spliceIfExist(1, 0, ' ')
      .spliceIfExist(2, 0, '(')
      .spliceIfExist(6, 0, ')')
      .spliceIfExist(7, 0, ' ')
      .spliceIfExist(11, 0, '-')
      .spliceIfExist(14, 0, '-');
    return cleanedNumberArray.join('');
  };

  const onChange = (e) => {
    e.preventDefault();
    resetError();
    if (keyCode === 8) {
      setPhone(e.currentTarget.value);
    } else {
      if (
        (phone.length > 17 &&
        phone[0] === '+') ||
        phone.length > 16 &&
        phone[0] !== '+'
      ) return;
      setPhone(setNumberMask(e.currentTarget.value));
    }
  };

  return (
    <>
      <div className={styles.logo}><Logo/></div>
      <form
        className={styles.formWrapper}
        onSubmit={onSubmit}
    >
        <div className={styles.inputHolder}>
          <input
            placeholder="Введите номер телефона"
            onKeyDown={(e) => setKeyCode(e.keyCode)}
            ref={input}
            onChange={onChange}
            className={getInputStyles(phone.length, isErrorPhone)}
            value={phone}
          />
          <div
            className={styles.close}
            onClick={(e) => {
              e.preventDefault();
              setPhone('');
            }}
          >
            <Close />
          </div>
        </div>
        {
          isErrorPhone &&
          <div className={styles.errorTextMsg}>Неправильный номер телефона</div>
        }

        <ActionButton
          type="submit"
          className={styles.button}
          isDisabled={isLoading}
        >
          Получить SMS-код
        </ActionButton>

        <div className={`${styles.row} ${styles.termMargin}`}>
          <span className={styles.terms}>
            Согласие на обработку данных
          </span>

          <div className={styles.bubble}>
            Нажимая кнопку «Получить SMS-код»,
            выражаю согласие ПАО «ВымпелКом» (Российская
            Федерация, 127083, г. Москва, ул. 8 Марта, д. 10,
            стр. 14) на обработку моего абонентского номера
            в целях авторизации.
          </div>
        </div>
      </form>
    </>
  );
};

export default observer(Phone);
