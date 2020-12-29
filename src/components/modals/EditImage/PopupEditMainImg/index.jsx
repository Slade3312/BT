import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ActionButton } from 'components/buttons';
import FixedOverlay from 'components/common/Popup/components/FixedOverlay';
import GlobalIcon from 'components/common/GlobalIcon';

import styles from './styles.pcss';


export function PopupEditMainImg({
  children,
  onClose,
  setFirstImage,
  setFirstStep,
  setSecondImage,
  step,
  rotateLeft,
  rotateRight,
}) {
  const input = useRef();
  useEffect(() => {
    input.current.focus();
  }, []);
  const onSubmit = e => {
    e.preventDefault();
    if (step === 1) {
      setFirstImage();
      return;
    }
    setSecondImage();
  };
  return (
    <FixedOverlay isOpen onClose={onClose} className={styles.overlay}>
      <div className={styles.component}>
        <form onSubmit={onSubmit}>
          <button className={`${styles.cross} ${styles.popupCloseButton}`} onClick={onClose} type="button">
            <GlobalIcon slug="crossThin" />
          </button>
          <input ref={input} className={styles.hiddenInput}/>
          <StepBody
            setFirstImage={setFirstImage}
            step={step}
            setFirstStep={setFirstStep}
            setSecondImage={setSecondImage}
            rotateLeft={rotateLeft}
            rotateRight={rotateRight}
          >
            {children}
          </StepBody>
        </form>
      </div>
    </FixedOverlay>
  );
}

const StepBody = ({
  children,
  setFirstStep,
  setSecondImage,
  setFirstImage,
  step,
  rotateLeft,
  rotateRight,
}) => {
  const firstStepButtons = () => (
    <ActionButton
      type="button"
      iconSlug="arrowRightMinimal"
      onClick={setFirstImage}
      className={styles.nextBtn}
    >
      Далее
    </ActionButton>
  );
  const secondStepButtons = () => (
    <div className={styles.btnsHolder}>
      <ActionButton
        type="button"
        onClick={setFirstStep}
        className={styles.backBtn}
      >
        Назад
      </ActionButton>
      <ActionButton
        type="button"
        iconSlug="arrowRightMinimal"
        onClick={setSecondImage}
        className={styles.saveBtn}
      >
        Сохранить
      </ActionButton>
    </div>
  );

  const firstStepHeader = () => (
    <>
      <p className={styles.header}>Основное<br/> изображение</p>
      <p className={styles.description}>Шаг 1. Кадрирование для форматов<br/> «Тизер» и «Баннер»</p>
    </>
  );

  const secondStepHeader = () => (
    <>
      <div className={styles.header}>Логотип компании</div>
      <div className={styles.description}>Шаг 2. Кадрирование для формата «Лента»</div>
    </>
  );
  return (
    <>
      {
        step === 1 &&
        firstStepHeader() ||
        secondStepHeader()
      }
      <div className={styles.imgHolder}>
        {children}
        <div className={styles.rotateHolders}>
          <div onClick={rotateLeft} className={styles.rotateLeft} role="button" tabIndex="0">
            <GlobalIcon slug="reloadWhite" />
          </div>
          <div onClick={rotateRight} className={styles.rotateRight} role="button" tabIndex="0">
            <GlobalIcon slug="reloadWhite" />
          </div>
        </div>
      </div>
      {
        step === 1 &&
        firstStepButtons() ||
        secondStepButtons()
      }
    </>
  );
};

StepBody.propTypes = {
  children: PropTypes.any,
  setFirstImage: PropTypes.func,
  rotateLeft: PropTypes.func,
  rotateRight: PropTypes.func,
  setFirstStep: PropTypes.func,
  setSecondImage: PropTypes.func,
  step: PropTypes.number,
};

PopupEditMainImg.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node,
  setFirstImage: PropTypes.func,
  setFirstStep: PropTypes.func,
  setSecondImage: PropTypes.func,
  step: PropTypes.number,
  rotateLeft: PropTypes.func,
  rotateRight: PropTypes.func,
};
