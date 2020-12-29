import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ACTION_TYPE_RELOAD, ACTION_TYPE_RESET } from 'pages/ErrorPage/constants';
import { ActionButton } from 'components/buttons';
import { Emoji } from 'components/common';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


class ErrorNotification extends Component {
  handleButtonClick({ href }) {
    if (href) {
      window.location.href = href;
    } else {
      window.location.reload();
    }
  }

  render() {
    const {
      title,
      description,
      button,
      icon,
      className,
      buttonActions,
    } = this.props;

    return (
      <div className={cx('wrapper', className)}>
        <Emoji path={icon} className={cx('emoji')} />

        <div className={cx('title')}>{title}</div>

        {description && <p className={cx('description')}>{description}</p>}

        {button && (
          <div className={cx('row')}>
            <ActionButton
              onClick={
                  () => this.handleButtonClick({
                    type: buttonActions?.type,
                    href: buttonActions?.href,
                  })
                }
              className={cx('button')}
            >
              {button}
            </ActionButton>
          </div>
        )}
      </div>
    );
  }
}


ErrorNotification.propTypes = {
  button: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string,
  buttonActions: PropTypes.object,
  description: PropTypes.string,
  infoLink: PropTypes.shape({
    href: PropTypes.string,
    text: PropTypes.string,
  }),
  infoButtonLink: PropTypes.shape({
    href: PropTypes.string,
    type: PropTypes.oneOf([ACTION_TYPE_RESET, ACTION_TYPE_RELOAD]),
    text: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default ErrorNotification;
