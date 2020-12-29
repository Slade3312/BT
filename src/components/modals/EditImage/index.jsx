import React, { useRef, useEffect, useState } from 'react';
import Cropper from 'cropperjs';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Social from 'store/mobx/Social';
import { OverlayLoader } from 'components/common';
import styles from './styles.pcss';
import { PopupEditMainImg } from './PopupEditMainImg';

const EditImage = ({ giveAnswer }) => {
  const image = useRef();
  const [step, setStep] = useState(1);
  const setFirstStep = () => setStep(1);

  const setFirstImage = () => {
    cropper.current.crop();
    const img = cropper.current.getCroppedCanvas().toDataURL('image/jpeg');
    Social.set('teaserImg', img);
    setStep(2);
  };

  const setSecondImage = () => {
    cropper.current.crop();
    const img = cropper.current.getCroppedCanvas().toDataURL('image/jpeg');
    Social.set('postImg', img);
    giveAnswer(true);
  };

  const rotateLeft = () => {
    cropper.current.rotate(-45);
  };

  const rotateRight = () => {
    cropper.current.rotate(45);
  };

  const cropper = useRef();

  useEffect(() => {
    cropper.current = new Cropper(image.current);
  }, []);

  useEffect(() => {
    if (step === 1) {
      cropper.current.setAspectRatio(1 / 1);
    }
    if (step === 2) {
      cropper.current.setAspectRatio(16 / 9);
    }
  }, [step]);

  return (
    <PopupEditMainImg
      setFirstImage={setFirstImage}
      setSecondImage={setSecondImage}
      setFirstStep={setFirstStep}
      rotateLeft={rotateLeft}
      rotateRight={rotateRight}
      step={step}
      opened
      onClose={() => {
        giveAnswer(false);
        Social.removeLogoImgData();
      }}
    >
      <OverlayLoader isLoading={false}>
        <div className={styles.wrapper}>
          <img src={Social.getMainImg} alt="Кадрирование изображения" ref={image} />
        </div>
      </OverlayLoader>
    </PopupEditMainImg>
  );
};

EditImage.propTypes = {
  giveAnswer: PropTypes.any,
};


export default observer(EditImage);
