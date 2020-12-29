import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { debounce } from 'utils/debounce';
import {
  checkSliderOutOfRange,
  getAccurateValue,
  slidersMeetResolver,
  correctIncomePositions,
} from './helpers.js';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

/**
 * TODO: rewrite this entire component, it is taken from another project and requires refactoring badly
 *  take different variations in account, like single slider, or discrete values
 */
export default class RangeSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 1,
      offset: null,
    };
    this.container = React.createRef();
    this.sliderFrom = React.createRef();
    this.sliderTo = React.createRef();
  }

  static getDerivedStateFromProps(props, prevState) {
    const {
      min,
      max,
      valueTo,
      valueFrom,
    } = props;
    // ===
    const {
      maxPosition: prevMaxPosition,
      minPosition: prevMinPosition,
      width,
    } = prevState;
    // count positions from values
    const maxPositionPercent = parseFloat(((valueTo - min) / (max - min)).toPrecision(2));
    const minPositionPercent = parseFloat(((valueFrom - min) / (max - min)).toPrecision(2));
    const maxPosition = maxPositionPercent * width;
    const minPosition = minPositionPercent * width;
    // cause we can change position from sliders and from changing values outside
    // before update we check if update is really needed
    if (maxPosition !== prevMaxPosition || minPosition !== prevMinPosition) {
      const {
        correctedMinPosition,
        correctedMaxPosition,
      } = correctIncomePositions(minPosition, maxPosition, 0, width);
      return {
        minPosition: correctedMinPosition,
        maxPosition: correctedMaxPosition,
      };
    }
    return null;
  }

  componentDidMount() {
    this.setDimensions();
    window.addEventListener('resize', this.setDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setDimensions);
  }

  setDimensions = debounce(() => {
    if (!this.container.current) return;
    // using containers current width to calculate position
    // on every resize
    // and left to correct slider offset on drag
    // and offsetLeft on transform: translate recalculations
    const dimensions = this.container.current.getBoundingClientRect();
    const { left } = dimensions;
    // ===
    const { offsetWidth: width, offsetLeft } = this.container.current;
    // ===
    const windowWidth = window.innerWidth;
    const offset = left <= windowWidth ? left
      : offsetLeft;
    // ===
    const {
      width: oldWidth,
      maxPosition: oldMaxPosition,
      minPosition: oldMinPosition,
    } = this.state;
    // ===
    const maxPositionPercent = oldMaxPosition / oldWidth;
    const minPositionPercent = oldMinPosition / oldWidth;
    const maxPosition = width * maxPositionPercent;
    const minPosition = width * minPositionPercent;
    // ===
    this.setState({
      width,
      offset,
      maxPosition,
      minPosition,
    });
  }, 0);

  valueChange = (position, isMaxUpdate, updateBothValues) => {
    const {
      onMaxValueChange,
      onMinValueChange,
      min,
      max,
    } = this.props;
    const { width } = this.state;
    // ===
    const value = getAccurateValue(position, width, min, max);
    if (updateBothValues) {
      if (onMaxValueChange) onMaxValueChange(value);
      if (onMinValueChange) onMinValueChange(value);
    } else if (isMaxUpdate && onMaxValueChange) {
      onMaxValueChange(value);
    } else if (!isMaxUpdate && onMinValueChange) {
      onMinValueChange(value);
    }
  };

  getMinIntervalWidth = () => {
    const { min, max, minInterval } = this.props;
    const { width } = this.state;
    return (width / (max - min)) * minInterval;
  }

  sliderDragHandle = (event, isMaxRangeChange, isClick) => {
    event.preventDefault();
    // state and props
    const { offset } = this.state;
    const { onClickChangeSlider, slidersMeetResolveWay } = this.props;
    // universal client new X coord for touch or mouse events
    const data = event.type === 'touchmove' ? event.touches[0] : event;
    const newPosition = data.clientX - offset;
    // check for out of range
    const {
      position,
      oldPosition,
      changePositionName,
    } = checkSliderOutOfRange(newPosition, isClick, onClickChangeSlider, isMaxRangeChange, ...this.state);
    const minIntervalWidth = this.getMinIntervalWidth();
    // ===
    if (position !== oldPosition) {
      // check for all sorts of intersections of min and max sliders
      const {
        resolvedState,
        resolvedPosition,
        isMaxUpdate,
        updateBothValues,
      } = slidersMeetResolver(
        changePositionName,
        position,
        isMaxRangeChange,
        isClick,
        onClickChangeSlider,
        slidersMeetResolveWay,
        minIntervalWidth,
        ...this.state,
      );

      this.setState(resolvedState, () => {
        this.valueChange(resolvedPosition, isMaxUpdate, updateBothValues);
      });
    }
  };

  maxRangeDragHandler = (event) => { this.sliderDragHandle(event, true); };
  minRangeDragHandler = (event) => { this.sliderDragHandle(event); };

  moveHandle = (event, isMaxRangeChange) => {
    if (!this.props.isDisabled) {
      // event prop for cases of touch or mouse events families
      const moveEvent = event.type === 'mousedown' ? 'mousemove' : 'touchmove';
      const moveEndEvent = event.type === 'mousedown' ? 'mouseup' : 'touchend';
      // universal handler name for min and max change cases
      const handler = `${isMaxRangeChange ? 'max' : 'min'}RangeDragHandler`;
      // ===
      window.addEventListener([moveEvent], this[handler]);
      window.addEventListener([moveEndEvent], () => {
        window.removeEventListener([moveEvent], this[handler]);
      });
    }
  };

  clickHandle = (event) => {
    const { isDisabled } = this.props;
    if (!isDisabled) {
      this.sliderDragHandle(event, false, true);
    }
  };

  render() {
    const {
      min,
      max,
      valueFrom,
      valueTo,
      isDisabled,
      tabIndex,
      isValueLabelled,
      className,
    } = this.props;
    const { maxPosition, minPosition } = this.state;
    // ===
    return (
      <div
        className={cx('slidersWrapper', className, { isDisabled })}
        ref={this.container}
      >
        <div className={cx('range')} onClick={this.clickHandle} role="presentation">
          <div
            className={cx('subrange', 'animate')}
            style={{ width: maxPosition - minPosition, left: minPosition }}
          />
        </div>
        <div
          role="slider"
          tabIndex={tabIndex}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueFrom}
          className={cx('slider', 'animate')}
          ref={this.sliderFrom}
          style={{ left: `${minPosition}px` }}
          onMouseDown={(e) => { this.moveHandle(e); }}
          onTouchStart={(e) => { this.moveHandle(e); }}
          data-valuemin={isValueLabelled ? `${valueFrom}:00` : null}
        />
        <div
          role="slider"
          tabIndex={tabIndex + 1}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueTo}
          className={cx('slider', 'animate')}
          ref={this.sliderTo}
          style={{ left: `${maxPosition}px` }}
          onMouseDown={(e) => { this.moveHandle(e, true); }}
          onTouchStart={(e) => { this.moveHandle(e, true); }}
          data-valuemax={isValueLabelled ? `${valueTo}:00` : null}
        />
      </div>
    );
  }
}

RangeSlider.propTypes = {
  min: PropTypes.number, // min available value
  max: PropTypes.number, // max available value
  valueFrom: PropTypes.number, // value of left slider
  valueTo: PropTypes.number, // value of right slider
  isValueLabelled: PropTypes.bool, // property for marked valueFrom/valueTo on slider
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  isDisabled: PropTypes.bool,
  onMinValueChange: PropTypes.func, // on left slider change callback
  onMaxValueChange: PropTypes.func, // on right slider change callback
  onClickChangeSlider: PropTypes.oneOf(['min', 'max', 'nearest']), // to choose which of sliders to move on click
  slidersMeetResolveWay: PropTypes.oneOf(['move', 'stop']), // behavior for situation of same min and max positions
  minInterval: PropTypes.number, // minimum posible difference between min and max
};

RangeSlider.defaultProps = {
  tabIndex: 0,
  onClickChangeSlider: 'nearest',
  slidersMeetResolveWay: 'stop',
};
