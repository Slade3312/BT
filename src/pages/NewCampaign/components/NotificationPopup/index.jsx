import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { ActionButton } from 'components/buttons';
import { Heading } from 'components/layouts';
import { PopupStateless, GlobalIcon } from 'components/common';


import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function NotificationPopup({
  isOpen, onClose, emoji, title, description, buttonText, onButtonClick, isMobile,
}) {
  return (
    <PopupStateless opened={isOpen} onClose={onClose} className={cx('popup', { mobile: isMobile })}>
      {emoji && <GlobalIcon slug={emoji} className={cx('emoji')} />}

      <Heading level={1} className={cx('title')}>{title}</Heading>

      <div className={cx('content')}>
        <Heading level={4} className={cx('description')}>
          {description}
        </Heading>

        {buttonText &&
          <ActionButton onClick={onButtonClick} className={cx('button')}>
            {buttonText}
          </ActionButton>
        }
      </div>
    </PopupStateless>
  );
}

NotificationPopup.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  emoji: PropTypes.any,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
  isMobile: PropTypes.bool,
};

NotificationPopup.defaultProps = {
  onButtonClick: () => {},
  onClose: () => {},
};
