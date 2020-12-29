import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ActionButton } from 'components/buttons';
import FixedOverlay from 'components/common/Popup/components/FixedOverlay';
import GlobalIcon from 'components/common/GlobalIcon';

import styles from './styles.pcss';

const cx = classNames.bind(styles);
export function PopupEditLogo({
  children,
  onClose,
  saveLogo,
  rotateLeft,
  rotateRight,
}) {
  return (
    <FixedOverlay isOpen onClose={onClose} className={cx('overlay')}>
      <div className={cx('component')}>
        <button className={cx('cross', 'popupCloseButton')} onClick={onClose} type="button">
          <GlobalIcon slug="crossThin" />
        </button>
        <p className={cx('header')}>Логотип компании</p>
        <p className={cx('description')}>Кадрирование для формата «Лента»</p>
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
        <ActionButton
          type="button"
          iconSlug="arrowRightMinimal"
          onClick={saveLogo}
          className={styles.nextBtn}
        >
          Сохранить
        </ActionButton>
      </div>
    </FixedOverlay>
  );
}

PopupEditLogo.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node,
  saveLogo: PropTypes.func,
  rotateLeft: PropTypes.func,
  rotateRight: PropTypes.func,
};
