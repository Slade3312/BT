import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { Heading } from 'components/layouts';
import { PopupStateless } from 'components/common';
import { ActionButton } from 'components/buttons';

import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

export default function InfoMessageModal({
  onClose,
  title,
  description,
  buttonText,
  buttonClass = '',
  imageSrc,
}) {
  return (
    <PopupStateless opened onClose={onClose}>
      <div className={cx('content')}>
        <img src={imageSrc} alt="emoji" title={title} className={cx('image')} />

        <Heading level={2}>{title}</Heading>

        <Heading level={4} className={cx('description')}>{description}</Heading>

        <ActionButton
          onClick={onClose}
          className={cx('button', 'closeButton', buttonClass)}
        >
          {buttonText}
        </ActionButton>
      </div>
    </PopupStateless>
  );
}

InfoMessageModal.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  imageSrc: PropTypes.string,
  buttonClass: PropTypes.string,
};
