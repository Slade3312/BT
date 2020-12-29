import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import Emoji from 'components/common/Emoji';
import defaultStyles from './styles.pcss';

function getHardPosition(width, position) {
  let bias = width / -2;

  if (position === 'right') {
    bias -= width / 2 - 16;
  } else if (position === 'left') {
    bias += width / 2 - 16;
  }

  return bias;
}

export function customTooltipFactory(customStyles) {
  const cx = classNames.bind(customStyles);

  class Tooltip extends React.Component {
    static propTypes = {
      /** Позиция хвоста tooltip\'a относительно иконки */
      position: PropTypes.oneOf(['left', 'center', 'right']),
      /** Позиция текста tooltip\'a относительно иконки */
      contentPosition: PropTypes.oneOf(['top']),
      /** Параметр для добавления дополнительных классов */
      className: PropTypes.string,
      /** Любой компонент или строка */
      children: PropTypes.node,
      /** Размер компонента tooltip */
      width: PropTypes.number,
      /** Callback */
      onShow: PropTypes.func,
      /** Icon/Emoji name */
      icon: PropTypes.func,
    }

    static defaultProps = {
      position: null,
      width: 300,
    }

    constructor(props) {
      super(props);

      this.state = {
        bias: getHardPosition(props.width, props.position),
      };
    }

    calculatePosition = () => {
      const { onShow, position } = this.props;
      if (onShow) onShow();

      if (position) return;

      const elem = this.textElem;
      const { left, right } = elem.getBoundingClientRect();
      let { bias } = this.state;

      if (left < 0) {
        bias += (left - 12) * -1;
      } else if (right > window.innerWidth) {
        bias -= right - window.innerWidth + 12;
      }

      this.setState({ bias });
    };

    render() {
      const { bias } = this.state;
      const { width, icon, className, contentPosition } = this.props;
      const onTop = contentPosition === 'top';

      return (
        <div
          className={cx('component', icon && 'hasIcon', className)}
          onMouseEnter={this.calculatePosition}
          onTouchStart={this.calculatePosition}
          onClick={() => {}}
          role="button"
          tabIndex={-1}
        >
          { icon
            ? <Emoji className={cx('emoji')} name={icon} />
            : (
              <div className={cx('icon')}>
                ?
              </div>
            )
          }

          <div className={cx('arrow', { onTop })} />
          <div
            className={cx('container', { onTop })}
            style={{
              transform: `translateX(${bias}px)`,
              width: `${width}px`,
            }}
            ref={(e) => { this.textElem = e; }}
          >
            <div className={cx('text')}>
              { this.props.children }
            </div>
          </div>
        </div>
      );
    }
  }

  return Tooltip;
}

export default customTooltipFactory(defaultStyles);
