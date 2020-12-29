import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { togglePageFix } from 'utils/scrollFixer';
import { GlobalIcon } from 'components/common';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default class MenuEntriesPopup extends React.PureComponent {
  componentDidUpdate() {
    togglePageFix(this.props.isOpen);
  }

  render() {
    const { isOpen, onClose, children, className } = this.props;

    return ReactDOM.createPortal(
      <div className={cx('popup', { active: isOpen }, className)}>
        <div className={cx('content')}>
          <div className={cx('crossIcon')} onClick={onClose}>
            <GlobalIcon slug="cross" />
          </div>
          {children}
        </div>
      </div>,
      document.body,
    );
  }
}

MenuEntriesPopup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
