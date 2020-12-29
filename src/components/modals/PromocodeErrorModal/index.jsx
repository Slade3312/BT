import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { PopupStateless } from 'components/common';
import { ActionButton } from 'components/buttons';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

const PromocodeErrorModal = ({ giveAnswer, description }) => {
  return (
    <PopupStateless opened onClose={() => giveAnswer(false)}>
      <div className={cx('content')}>
        <p className={cx('description')}>{description}</p>

        <div className={cx('buttonsContainer')}>
          <ActionButton
            onClick={() => giveAnswer(false)}
            className={cx('button', 'closeButton')}
          >
            Продолжить редактирование
          </ActionButton>

          <ActionButton
            onClick={() => giveAnswer(true)}
            className={cx('button', 'confirmButton')}
          >
            Отправить без промокода
          </ActionButton>
        </div>
      </div>
    </PopupStateless>
  );
};

PromocodeErrorModal.propTypes = {
  description: PropTypes.string,
  giveAnswer: PropTypes.func,
};

export default PromocodeErrorModal;
