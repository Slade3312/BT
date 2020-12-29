import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { Heading } from 'components/layouts';
import { PopupStateless, OverlayLoader } from 'components/common';
import { ActionButton } from 'components/buttons';
import { TextAreaInput } from 'components/fields/TextInput';

import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

export default function AskQuestionModal({
  onClose,
  title,
  description,
  buttonDeclineText,
  buttonConfirmText,
  placeholder,
  emptyValidationText,
  onQuestionSend,
  isLoading,
}) {
  const [questionValue, setQuestionValue] = useState('');
  const [error, setError] = useState('');

  const handleQuestionChange = (data) => {
    setQuestionValue(data);
  };

  const handleConfirmButtonClick = () => {
    if (!questionValue.length) {
      setError(emptyValidationText);
      return;
    }
    onQuestionSend(questionValue);
  };

  return (
    <PopupStateless opened onClose={onClose}>
      <div className={cx('content')}>
        <Heading level={2} className={cx('title', 'marb-m')}>{title}</Heading>

        <p className={cx('description')}>{description}</p>

        <OverlayLoader isLoading={isLoading}>
          <TextAreaInput
            value={questionValue}
            placeholder={placeholder}
            onChange={handleQuestionChange}
            className={cx('questionTextField')}
            error={error}
          />

          <div className={cx('buttonsContainer')}>
            <ActionButton
              onClick={onClose}
              className={cx('button', 'closeButton')}
            >
              {buttonDeclineText}
            </ActionButton>

            <ActionButton
              onClick={handleConfirmButtonClick}
              className={cx('button', 'confirmButton')}
            >
              {buttonConfirmText}
            </ActionButton>
          </div>
        </OverlayLoader>
      </div>
    </PopupStateless>
  );
}

AskQuestionModal.propTypes = {
  onClose: PropTypes.func,
  onQuestionSend: PropTypes.func,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  description: PropTypes.string,
  buttonDeclineText: PropTypes.string,
  buttonConfirmText: PropTypes.string,
  placeholder: PropTypes.string,
  emptyValidationText: PropTypes.string,
};
