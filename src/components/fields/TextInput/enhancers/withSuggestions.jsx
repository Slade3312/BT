import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import CustomPropTypes from 'utils/prop-types';
import { escapeStringRegexp } from 'utils/fn';
import { ignoreState } from 'utils/decorators';
import { triggerFormSubmit } from 'utils/forms';
import withForwardedRef from 'enhancers/withForwardedRef';
import OutsideClickTracker from 'components/common/OutsideClickTracker';
import SuggestionsList from './components/SuggestionsList';

import styles from './parts/withSuggestions/styles.pcss';

const cx = classNames.bind(styles);

function defaultStringFilter(item, value = '', itemCaptionExtractor) {
  const wordStartsWithRegExp = new RegExp(`(^| )${escapeStringRegexp(value.toLowerCase())}`);
  return item && wordStartsWithRegExp.test(itemCaptionExtractor(item).toLowerCase());
}

// TODO: Component that was bloated already, became overbloated now, need to refactor and split up logic
//  instead of using UNSAFE_selectMode
export default function withSuggestions(WrappedInput) {
  /**
   * Поле ввода с автодополнением.
   */
  class SuggestInput extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        focus: false,
        activeItemIndex: null,
        filteredItems: props.items,
      };
    }

    static getDerivedStateFromProps = ignoreState(nextProps => ({
      filteredItems: nextProps.filter(nextProps.value, nextProps.items, nextProps.itemCaptionExtractor),
      activeItemIndex: nextProps.UNSAFE_selectMode ? 0 : null,
    }));

    getItemComponent = () => {
      if (this.props.ItemComponent) return this.props.ItemComponent;
      return this.DefaultItemComponent;
    };

    DefaultItemComponent = ({ value }) => (
      <div className={cx('item')}>
        {this.props.itemCaptionExtractor(value)}
      </div>
    );

    getInputElement = () => this.props.forwardedRef.current;

    cleanUp = () => {
      const { UNSAFE_selectMode, onChange } = this.props;

      /**
       * For selectMode, we simply erase text value
       * otherwise, we just remove focus from the field
       */
      if (UNSAFE_selectMode) {
        onChange('');
      } else {
        this.setState({ focus: false });
      }
    };

    handleInputChange = (value) => {
      const { onChange } = this.props;
      if (onChange) this.setState({ focus: true }, () => onChange(value));
    };

    handleFocus = () => {
      this.setState({ focus: true });
    };

    handleKeyDown = (event) => {
      const { activeItemIndex, filteredItems, focus } = this.state;

      if (['ArrowDown', 'ArrowUp', 'Enter'].indexOf(event.key) === -1) {
        return;
      }

      event.preventDefault();
      if (event.key === 'ArrowDown') {
        let newIndex;
        if (activeItemIndex === null || !focus) {
          newIndex = 0;
        } else if (activeItemIndex < filteredItems.length - 1) {
          newIndex = activeItemIndex + 1;
        } else {
          newIndex = filteredItems.length - 1;
        }
        this.setState({ activeItemIndex: newIndex, focus: true });
      } else if (event.key === 'ArrowUp') {
        const newIndex = activeItemIndex - 1 >= 0 ? activeItemIndex - 1 : 0;
        this.setState({ activeItemIndex: newIndex });
      } else if (event.key === 'Enter') {
        if (this.hasActiveOption()) {
          this.selectItem(this.getActiveOption());
        } else {
          this.handleConfirmChange();
        }
      }
    };

    selectItem = (item) => {
      const { itemCaptionExtractor, items, filter, onChange, UNSAFE_selectMode } = this.props;

      if (UNSAFE_selectMode) {
        this.handleConfirmChange(item.value);
      } else {
        const filterValue = itemCaptionExtractor(item);
        this.setState({
          filteredItems: filter(filterValue, items, itemCaptionExtractor),
        }, () => {
          if (onChange) onChange(filterValue);
          this.handleConfirmChange(filterValue);
        });
      }
    };

    getActiveOption = () => {
      const { activeItemIndex, filteredItems } = this.state;
      return filteredItems[activeItemIndex];
    };
    hasActiveOption = () => !!this.getActiveOption() && this.isSuggestionListOpen();
    getActiveOptionValue = () => this.getActiveOption().value;

    handleConfirmChange = (value) => {
      const { UNSAFE_selectMode, onConfirmChange } = this.props;

      if (onConfirmChange) {
        if (UNSAFE_selectMode) {
          if (this.hasActiveOption()) {
            onConfirmChange(value || this.getActiveOptionValue());
            this.cleanUp();
          }
        } else {
          onConfirmChange(value || this.props.value);
          this.cleanUp();
        }
      } else if (typeof this.props.onConfirmChange === 'undefined') {
        const input = this.getInputElement();
        if (input && input.form) {
          setTimeout(() => {
            triggerFormSubmit(input.form);
          }, 0);
        }
      }
    };

    excludeOwnProps = () => {
      // Исключаем собственные props, чтобы не передавать их в TextInput
      const {
        items, maxItemsView, itemCaptionExtractor, filter,
        onConfirmChange, ItemComponent,
        showWithEmptyValue, showEmptyList, EmptyListComponent,
        UNSAFE_selectMode, forwardedRef, className, DropDownBottomComponent, ...inputProps
      } = this.props;

      return inputProps;
    };

    getItems = () => {
      const { filteredItems } = this.state;
      const { maxItemsView } = this.props;
      return maxItemsView ? filteredItems.slice(0, maxItemsView) : filteredItems;
    };

    isSuggestionListOpen = () => {
      const { value, showWithEmptyValue } = this.props;
      const { focus } = this.state;
      return !!(focus && (showWithEmptyValue || value));
    };

    render() {
      const { forwardedRef, className } = this.props;

      return (
        <OutsideClickTracker className={cx('container', className)} onOutsideClick={this.cleanUp}>
          <WrappedInput
            {...this.excludeOwnProps()}
            className={cx({ inputOpened: this.isSuggestionListOpen() })}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            autoComplete="off"
            ref={forwardedRef}
          />

          {this.isSuggestionListOpen() ? (
            <SuggestionsList
              items={this.getItems()}
              ItemComponent={this.getItemComponent()}
              onItemClick={(event, item) => this.selectItem(item)}
              activeItemIndex={this.state.activeItemIndex}
              showEmptyList={this.props.showEmptyList}
              EmptyListComponent={this.props.EmptyListComponent}
              DropDownBottomComponent={this.props.DropDownBottomComponent}
            />
          ) : null}
        </OutsideClickTracker>
      );
    }
  }

  SuggestInput.propTypes = {
    /**
     * Максимальное количество отфильтрованных элементов (если нет то все)
     */
    maxItemsView: PropTypes.number,
    /**
     * Массив объектов для автодополнения.
     */
    items: PropTypes.array,
    /**
     * Значение по умолчанию.
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /**
     * Функция для получения отображаемого текста для объектов.
     */
    itemCaptionExtractor: PropTypes.func,
    /**
     * Функция фильтрации объектов.
     */
    filter: PropTypes.func,
    /**
     * Обработчик изменения значения.
     */
    onChange: PropTypes.func,
    /**
     * Обработчик изменения при нажатии enter либо выборе пункта из списка
     * Если передан undefined, то производит действие по умолчанию браузера - submit ближайшей формы
     */
    onConfirmChange: PropTypes.func,
    /**
     * Компонент для отображения значения в выпадающем списке.
     */
    ItemComponent: PropTypes.func,
    /**
     * Компонент для отображения тултипа после всех опций
     */
    DropDownBottomComponent: PropTypes.func,
    /**
     * Признак, определяющий, показывать ли доступные значения при пустом
     * значении в поле.
     */
    showWithEmptyValue: PropTypes.bool,
    /**
     * Признак, определяющий, показывать ли компонент при пустом списке.
     */
    showEmptyList: PropTypes.bool,
    /**
     * Компонент для пустого значения
     */
    EmptyListComponent: PropTypes.func,
    /**
     * Режим работы `Select`, вместо ввода текста, на onConfirmChange, возвращает `value` из { label, value } пар
     */
    UNSAFE_selectMode: PropTypes.bool,
    forwardedRef: CustomPropTypes.ref,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  SuggestInput.defaultProps = {
    items: [],
    value: null,
    itemCaptionExtractor: value => value.toString(),
    filter: (value, items, itemCaptionExtractor) =>
      items.filter(item => defaultStringFilter(item, value, itemCaptionExtractor)),
    ItemComponent: null,
    onChange: null,
    onConfirmChange: undefined,
    showWithEmptyValue: false,
    showEmptyList: false,
    EmptyListComponent: undefined,
  };


  /**
   * Override component name by prepending `Suggest~`
   * to make it look nice, for example: `SuggestTextInput`
   */
  if (process.env.NODE_ENV !== 'production') {
    const WrappedComponentName = WrappedInput.displayName || WrappedInput.name || 'Input';
    SuggestInput.displayName = `Suggest${WrappedComponentName}`;
  }

  return withForwardedRef(SuggestInput);
}
