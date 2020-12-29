import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { Heading } from 'components/layouts';
import { PopupStateless } from 'components/common';
import { ActionButton } from 'components/buttons';


import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

export default function RemoveCampaignModal({
  onClose,
  title,
  description,
  buttonDecline,
  buttonConfirm,
}) {
  return (
    <PopupStateless opened onClose={onClose}>
      <div className={cx('content')}>
        <Heading level={1} className={cx('marb-m')}>
          {title}
        </Heading>

        <Heading level={3} className={cx('description')}>
          {description}
        </Heading>

        <div className={cx('buttonsContainer')}>
          <ActionButton
            onClick={onClose}
            className={cx('button', 'closeButton')}
          >
            {buttonDecline.text}
          </ActionButton>

          <ActionButton
            onClick={buttonConfirm.onClick}
            className={cx('button', 'confirmButton')}
          >
            {buttonConfirm.text}
          </ActionButton>
        </div>
      </div>
    </PopupStateless>
  );
}

RemoveCampaignModal.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonDecline: PropTypes.shape({
    text: PropTypes.string,
  }),
  buttonConfirm: PropTypes.shape({
    text: PropTypes.string,
    onClick: PropTypes.func,
  }),
};
