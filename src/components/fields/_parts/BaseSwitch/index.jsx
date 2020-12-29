import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import Preloader from './preloader.svg';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default class Switch extends Component {
  static propTypes = {
    /** Определяет состояние прелоадера: активен/не активен */
    isLoading: PropTypes.bool,
    /** Блокирует переключение состояния компонента */
    disabled: PropTypes.bool,
    /** Параметр для добавления дополнительных классов */
    className: PropTypes.any,
    /** Определяет состояние прелоадера: активен/не активен */
    isFuture: PropTypes.bool,
    /** Callback */
    onChange: PropTypes.func,
    /** Определяет состояние атрибута: активен/не активен */
    checked: PropTypes.bool,
    /** Имя переключателя */
    name: PropTypes.string,
  }

  static defaultProps = {
    onChange: () => {},
  };

  handleChange = (event) => {
    this.props.onChange(event);
  }

  render() {
    const {
      isLoading,
      className,
      disabled,
      isFuture,
      checked,
      name,
    } = this.props;

    return (
      <div className={cx('component', className, { disabled, isLoading, isFuture })}>
        <label className={cx('switch')}>
          <input
            onChange={this.handleChange}
            data-component="Switch"
            className={cx('input')}
            disabled={disabled}
            checked={checked}
            type="checkbox"
            name={name}
          />

          <span className={cx('back')} />
          {(isFuture || isLoading) && (
            <div className={cx('preloaderContainer')}>
              <Preloader className={cx('preloader')} />
            </div>
          )}

          <span className={cx('circle')} />
        </label>
      </div>
    );
  }
}
