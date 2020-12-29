import React, { useRef, useEffect } from 'react';
import { useLocalStore, useObserver, observer } from 'mobx-react';
import { reaction } from 'mobx';
import Authorization from 'store/mobx/Authorization';
import { OverlayLoader } from 'components/common/Loaders/components';
import { Logo } from '../assets';
import styles from './styles.pcss';

const TOTAL_INPUTS = 3;

const Sms = () => {
  const { phone, setScreen } = Authorization;
  const goBack = () => setScreen('phone');
  const fields = {};
  fields[0] = useRef();
  fields[1] = useRef();
  fields[2] = useRef();
  fields[3] = useRef();
  const state = useLocalStore(() => ({
    code: {
      0: '',
      1: '',
      2: '',
      3: '',
    },
    isFieldsDisabled: false,
    keyCode: null,
    codeVerifying: false,
    onKeyDown: (e, index) => {
      state.keyCode = e.keyCode;
      if (state.keyCode === 8 && state?.code[index - 1] && state?.code[index - 1].length && !state?.code[index]?.length) {
        state.code[index - 1] = '';
        fields[index - 1].current.focus();
      }
    },

    inputSmsCode: (e, index, value) => {
      state.isError = false;
      if (state.keyCode === 8 && state?.code[index]?.length) {
        state.code[index] = '';
        return;
      }

      if (state?.code[index]?.length && !state?.code[index + 1]?.length) {
        if (index < TOTAL_INPUTS && state.code[index + 1]?.length) {
          fields[`${index + 1}`].current.focus();
          state.code[index + 1] = value;
        }
      } else {
        state.code[index] = value;
        if (state.code[index].length) {
          fields[`${index + 1}`] && fields[`${index + 1}`].current.focus();
        }
      }
    },
    isFocused: true,
    isFirstTimeInputed: false,
    verifyCode: async () => {
      if (Object.values(state.code).join('').length !== 4) return;
      state.codeVerifying = true;
      try {
        await Authorization.phoneConfirmation({ phone: phone.replace(/\D/g, ''), code: Object.values(state.code).join('') });
        state.isFieldsDisabled = true;

        localStorage.setItem('isJustLoggedIn', 'string_true');
        window.location.reload();
      } catch (e) {
        state.isError = true;
        state.code = {
          0: '',
          1: '',
          2: '',
          3: '',
        };
        fields[0].current.focus();
      } finally {
        state.codeVerifying = false;
      }
    },
    sendPhone: async () => {
      await Authorization.phoneConfirmation({ phone: phone.replace(/\D/g, '') });
    },
    isError: false,
  }));

  useEffect(() => {
    fields[0].current.focus();
    reaction(
      () => { return Object.values(state.code).every(el => el.length); },
      () => { state.verifyCode(); },
    );
  }, []);

  useEffect(() => {
    state.isFieldsDisabled = false;
  }, []);

  useEffect(() => {
    const sendCode = setInterval(() => {
      if (Authorization.timeLeft) {
        Authorization.timeLeft -= 1;
      }
    }, 1000);
    if (Authorization.timeLeft === 0) clearInterval(sendCode);
    return () => {
      clearInterval(sendCode);
    };
  }, []);

  const onPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('Text');
    if (text.length === 4 && text.replace(/\D/g, '').length === 4) {
      text.split('').forEach((number, idx) => {
        state.code[idx] = number;
      });
    }
  };

  return useObserver(() => (
    <>
      <div className={styles.logoSms}><Logo/></div>
      <div className={styles.smsContainer}>
        <OverlayLoader isLoading={state.codeVerifying}>

          <p className={styles.title}>
            Мы отправили код на {phone}
            <span className={styles.numberChange} onClick={goBack}>Изменить</span>
          </p>
          {
            Object.values(state.code).map((field, index) => {
              return (
                <input
                  className={`${styles.field} ${state.isError ? styles.smsCodeError : null}`}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  disabled={state.isFieldsDisabled}
                  ref={fields[index]}
                  onPaste={onPaste}
                  onKeyDown={(e) => state.onKeyDown(e, index)}
                  onChange={(e) => state.inputSmsCode(e, index, e.currentTarget.value)}
                  value={state.code[index]}
                />
              );
            })
          }

          {
              state.isError &&
              <div className={styles.errorTextMsg}>Неверный код</div>
          }

        </OverlayLoader>
        <div className={styles.termsHolder}>
          <div className={`${styles.row} ${styles.termMargin}`}>
            {
              Authorization.timeLeft &&
              <span className={styles.text}>Получить новый SMS-код можно через {Authorization.timeLeft}</span> ||
              <span className={styles.sendCode} onClick={state.sendPhone}>Получить новый SMS-код</span>
            }
          </div>

          <div className={`${styles.row} ${styles.smsRow}`}>
            <span className={styles.cantGetText}>Не приходит SMS?</span>
            <div className={styles.bubble}>
              <div className={styles.cantGetSmsRow}>
                <span className={styles.cantGetSmsNumber}>1.</span>
                Проверьте правильность заполненного номера телефона
              </div>
              <div className={styles.cantGetSmsRow}>
                <span className={styles.cantGetSmsNumber}>2.</span>
                Позвоните по бесплатному номеру <br/> 8 (800) 600-62-62
              </div>
              <div className={styles.cantGetSmsRow}>
                <span className={styles.cantGetSmsNumber}>3.</span>
                Проблемы могут быть со стороны вашего сотового оператора, нужно обратиться в их службу поддержки
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ));
};

export default observer(Sms);
