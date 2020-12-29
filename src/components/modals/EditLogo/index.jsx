import React, { useRef, useEffect } from 'react';
import Cropper from 'cropperjs';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Social from 'store/mobx/Social';
import { OverlayLoader } from 'components/common';
import styles from './styles.pcss';
import { PopupEditLogo } from './PopupEditLogo';

const EditImage = ({ giveAnswer }) => {
  const image = useRef();
  const input = useRef();

  const saveLogo = () => {
    cropper.current.crop();
    const img = cropper.current.getCroppedCanvas().toDataURL('image/jpeg');
    Social.set('logoImg', img);
    Social.uploadLogo();
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
    cropper.current = new Cropper(image.current, {
      aspectRatio: 1 / 1,
    });
  }, []);

  useEffect(() => {
    input.current.focus();
  }, []);
  const onSubmit = e => {
    e.preventDefault();
    saveLogo();
  };

  return (
    <PopupEditLogo
      saveLogo={saveLogo}
      rotateLeft={rotateLeft}
      rotateRight={rotateRight}
      opened
      onClose={() => giveAnswer(false)}
    >
      <OverlayLoader isLoading={false}>
        <form onSubmit={onSubmit}>
          <input ref={input} className={styles.hiddenInput}/>
          <div className={styles.wrapper}>
            <img src={Social.getLogoForEdit} alt="Кадрирование изображения" ref={image} />
          </div>
        </form>
      </OverlayLoader>
    </PopupEditLogo>
  );
};

EditImage.propTypes = {
  giveAnswer: PropTypes.any,
};


export default observer(EditImage);
