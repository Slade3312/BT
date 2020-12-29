export const compareOutOfRange = (value, width) => {
  if (value > width) {
    return width;
  } else if (value < 0) {
    return 0;
  }
  return value;
};
// it's a function to calculate isMaxRangeChange analogue
// for click with 'nearest' prop case
export const isInSecondHalf = (position, width, offset) => {
  const halfOffset = offset / 2;
  const halfWidth = (width - halfOffset) / 2;
  return position >= halfWidth;
};

export const checkSliderOutOfRange = (newPosition, isClick, onClickChangeSlider, isMaxRangeChange, state) => {
  const { width, offset } = state;
  // name of state property to change
  let changePositionName = '';
  // if function triggered from click
  if (isClick) {
    // onClickChangeSlider is one of ['min', 'max', 'nearest']
    // so first case for 'min', 'max'
    if (onClickChangeSlider !== 'nearest') {
      changePositionName = `${onClickChangeSlider}Position`;
    // and here we just compare which slider is on the same half
    // as it was clicked
    } else {
      changePositionName = `${isInSecondHalf(newPosition, width, offset) ? 'max' : 'min'}Position`;
    }
    // if function triggered from mousemove or touch
  } else {
    changePositionName = `${isMaxRangeChange ? 'max' : 'min'}Position`;
  }
  // get previous position from state, for slider to decide
  // should it update slider position or not
  // and compare if it out of range
  const { [changePositionName]: oldPosition } = state;
  const inRangePosition = compareOutOfRange(newPosition, width);

  return {
    position: inRangePosition,
    oldPosition,
    changePositionName,
  };
};

export const slidersMeetResolver = (
  changePositionName,
  position,
  isMaxRangeChange,
  isClick, onClickChangeSlider, slidersMeetResolveWay, minIntervalWidth, state,
) => {
  // here we have default value, in cases, when there is nothing to resolve
  const resolvedState = {
    [changePositionName]: position,
  };
  // ===
  const { minPosition, maxPosition, width, offset } = state;
  // here we check what slider is scrolled
  let minSliderActive = !isMaxRangeChange;
  let maxSliderActive = isMaxRangeChange;
  // in case of click, we check which slider will be changed
  // in cases of 'min'/'max' we simple takes out what slider we may resolve
  if (isClick && onClickChangeSlider !== 'nearest') {
    minSliderActive = onClickChangeSlider === 'min';
    maxSliderActive = onClickChangeSlider === 'max';
  // in case of 'nearest' option - we use isInSecondHalf function result
  } else if (isClick && onClickChangeSlider === 'nearest') {
    minSliderActive = !isInSecondHalf(position, width, offset);
    maxSliderActive = isInSecondHalf(position, width, offset);
  }
  // compare position with previously set with condition
  // if it is the case for resolve
  const isBeforeMin = (position - minIntervalWidth <= minPosition) && maxSliderActive;
  const isAfterMax = (position + minIntervalWidth >= maxPosition) && minSliderActive;
  // ===
  const shouldResolveRanges = isBeforeMin || isAfterMax;
  // then resolve due to slidersMeetResolveWay prop
  // in case of stop - prevent from changing
  // in case of move - change both sliders
  if (shouldResolveRanges && slidersMeetResolveWay === 'move') {
    const movePositionName = `${isAfterMax ? 'max' : 'min'}Position`;
    resolvedState[movePositionName] = position;
    // ===
  } else if (shouldResolveRanges && slidersMeetResolveWay === 'stop') {
    const stopPositionName = `${isAfterMax ? 'max' : 'min'}Position`;
    const { [stopPositionName]: positionValue } = state;
    const stopPositionValue = isAfterMax
      ? positionValue - minIntervalWidth
      : positionValue + minIntervalWidth;
    resolvedState[changePositionName] = stopPositionValue;
  }

  return {
    resolvedState,
    resolvedPosition: resolvedState[changePositionName],
    isMaxUpdate: maxSliderActive,
    updateBothValues: shouldResolveRanges && slidersMeetResolveWay === 'move',
  };
};

export const getAccurateValue = (position, width, min, max) => {
  const proportionRaw = position / width;
  const countedProportion = parseFloat(proportionRaw.toFixed(2));

  const value = (countedProportion * (max - min)) + min;
  return Math.round(value);
};

// min - 0, max - container width,
// if positions out of range or intersect, cause of incorrect inputs
// returned positions will be in ranges and/or in same position
// in cases, when there is no values changes from outside of RangeSlider component
// we have a pair of checkSliderOutOfRange && slidersMeetResolver funcs
// for behaviour purposes
export const correctIncomePositions = (minPosition, maxPosition, min, max) => {
  let correctedMinPosition = minPosition < min ? min : minPosition;
  let correctedMaxPosition = maxPosition > max ? max : maxPosition;
  // ===
  if (correctedMaxPosition < correctedMinPosition
      || correctedMinPosition > correctedMaxPosition) {
    // ===
    correctedMinPosition = correctedMinPosition > correctedMaxPosition ?
      correctedMaxPosition : correctedMinPosition;
    // ===
    correctedMaxPosition = correctedMaxPosition < correctedMinPosition ?
      correctedMinPosition : correctedMaxPosition;
  }
  return {
    correctedMinPosition,
    correctedMaxPosition,
  };
};
