import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { PureButton } from 'components/buttons';

import { GlobalIcon } from '../../../common';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default class AddNumberButton extends Component {
  onClick = (event) => {
    if (event.metaKey || event.shiftKey || event.altKey || event.ctrlKey) {
      return;
    }
    this.props.onClick(event);
  };

  render() {
    return (
      <PureButton
        className={cx('addButton', {
          link: true,
        })}
        onClick={this.onClick}
      >
        <GlobalIcon className={cx('icon')} icon={this.props.icon} />

        <p className={cx('text')}>{this.props.children}</p>
      </PureButton>
    );
  }
}

AddNumberButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.node,
  children: PropTypes.node,
};
