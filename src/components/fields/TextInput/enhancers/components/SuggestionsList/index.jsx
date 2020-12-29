/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default class SuggestionsList extends React.Component {
  handleClick = (event, item) => {
    if (this.props.onItemClick) {
      this.props.onItemClick(event, item);
    }
  };

  render() {
    const {
      items,
      ItemComponent,
      activeItemIndex,
      showEmptyList,
      EmptyListComponent,
      isPending,
      PendingComponent,
      DropDownBottomComponent,
    } = this.props;

    if (isPending) {
      return (
        <div className={cx('container')}>
          <PendingComponent />
        </div>
      );
    }

    this.activeRef = null;

    return (
      <div
        className={cx('container')}
        ref={(container) => { this.container = container; }}
      >
        {
          items.length
          ? items.map((item, index) => {
            const isActive = activeItemIndex >= 0 && index === activeItemIndex;
            return (
              <div
                className={cx('component', { active: isActive })}
                key={+index}
                onClick={event => this.handleClick(event, item)}
                ref={(el) => { if (isActive) this.activeRef = el; }}
                role="listitem"
              >
                <ItemComponent value={item} isActive={isActive} />
              </div>
);
          })
          : (showEmptyList && <EmptyListComponent />)
        }

        {DropDownBottomComponent && <DropDownBottomComponent items={items} />}
      </div>
    );
  }
}

SuggestionsList.propTypes = {
  /**
   * Массив объектов для отображения в выпадающем списке.
   */
  items: PropTypes.array,
  /**
   * Компонент для отображения значения в выпадающем списке.
   */
  ItemComponent: PropTypes.func,
  /**
   * Индекс текущего активного элемента.
   */
  activeItemIndex: PropTypes.number,
  /**
   * Действие при клике по значению.
   */
  onItemClick: PropTypes.func,
  /**
   * Признак, определяющий, показывать ли компонент при пустом списке.
   */
  showEmptyList: PropTypes.bool,
  /**
   * Компонент для отображения тултипа после всех опций
   */
  DropDownBottomComponent: PropTypes.func,
  /**
   * Компонент для пустого значения
   */
  EmptyListComponent: PropTypes.func,
  /**
   * Признак выполнения загрузки.
   */
  isPending: PropTypes.bool,
  /**
   * Компонент для отображения загрузки списка.
   */
  PendingComponent: PropTypes.func,
};

const SuggestionsListItem = ({ value }) => <span className={cx('item')}>{value}</span>;
SuggestionsListItem.propTypes = {
  value: PropTypes.string,
};

SuggestionsList.defaultProps = {
  items: [],
  ItemComponent: SuggestionsListItem,
  activeItemIndex: null,
  onItemClick: null,
  showEmptyList: false,
  EmptyListComponent: () => (<div className={cx('emptyList')}>Ничего не найдено</div>),

  isPending: false,

  PendingComponent: () => (<div className={cx('emptyList')}>Загрузка...</div>),
};
