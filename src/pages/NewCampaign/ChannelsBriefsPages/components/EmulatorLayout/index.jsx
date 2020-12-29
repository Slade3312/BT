import React, { useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import phoneMessenger from 'images/phone.png';
import phoneNotification from 'images/phone-notification.png';
import { NotificationMessageBox, SmsMessageBox } from './components';

import styles from './styles.pcss';
import ProcessMessageText from './components/ProcessMessageText';

const cx = classNames.bind(styles);

const defaultMessage = 'Ваш текст сообщения будет отображаться тут';

export default function EmulatorLayout({ children, message, senderName, emulatorType, className }) {
  const renderEmulationScreen = useCallback(() => {
    if (emulatorType === EmulatorLayout.types.notification) {
      return (
        <Fragment>
          <div className={cx('messageBox')}>
            <NotificationMessageBox>
              <ProcessMessageText>{message || defaultMessage}</ProcessMessageText>
            </NotificationMessageBox>
          </div>
          <img className={cx('image')} alt="phone emulation push screen" src={phoneNotification} />
        </Fragment>
      );
    }
    if (emulatorType === EmulatorLayout.types.messenger) {
      return (
        <Fragment>
          <div className={cx('senderWrapper')}>
            <span className={cx('senderName')}>{senderName}</span>
          </div>
          {message && (
            <div className={cx('messageBox')}>
              <SmsMessageBox>
                <ProcessMessageText>{message}</ProcessMessageText>
              </SmsMessageBox>
            </div>
          )}
          <img className={cx('image')} alt="phone emulation messenger screen" src={phoneMessenger} />
        </Fragment>
      );
    }
    return null;
  }, [emulatorType, message, senderName]);

  return (
    <div className={cx('component', className)}>
      <div className={cx('content')}>{children}</div>
      <div className={cx('emulatorContent')}>{renderEmulationScreen()}</div>
    </div>
  );
}

EmulatorLayout.defaultProps = {
  senderName: 'Имя отправителя',
};

EmulatorLayout.types = {
  notification: Symbol('emulator-notification'),
  messenger: Symbol('emulator-messenger'),
};

EmulatorLayout.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
  emulatorType: PropTypes.symbol,
  className: PropTypes.string,
  senderName: PropTypes.string,
};
