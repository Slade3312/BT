import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { PopupStateless } from 'components/common';
import { ActionButton } from 'components/buttons';
import { Heading } from 'components/layouts';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

const CustomSegmentNotifyModal = ({ description, onConfirm, onCancel, title }) => {
  return (
    <PopupStateless opened onClose={onCancel} hideCloseButton>
      <div className={cx('content')}>
        <Heading level={2}>{title}</Heading>

        <p className={cx('description')}>{description}</p>

        <div className={cx('buttonsContainer')}>
          <ActionButton
            onClick={onCancel}
            className={cx('button', 'closeButton')}
          >
            Отмена
          </ActionButton>

          <ActionButton
            onClick={() => onConfirm()}
            className={cx('button', 'confirmButton')}
          >
            Хорошо
          </ActionButton>
        </div>
      </div>
    </PopupStateless>
  );
};

CustomSegmentNotifyModal.propTypes = {
  description: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.string,
};

export default CustomSegmentNotifyModal;
