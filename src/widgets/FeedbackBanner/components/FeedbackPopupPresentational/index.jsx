import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { Heading } from 'components/layouts';
import { ActionButton } from 'components/buttons';
import { PopupStateless } from 'components/common';


import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

export default function FeedbackPopupPresentational({ onClose, title, description, buttonText, children }) {
  return (
    <PopupStateless opened onClose={onClose}>
      <div className={cx('content')}>
        <Heading level={1} className={cx('marb-m')}>{title}</Heading>

        <Heading level={4} className={cx('description', 'marb-l')}>
          {description}
        </Heading>

        {children}

        {buttonText && <ActionButton onClick={onClose} className={cx('button')}>{buttonText}</ActionButton>}
      </div>
    </PopupStateless>
  );
}

FeedbackPopupPresentational.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  children: PropTypes.node,
};
