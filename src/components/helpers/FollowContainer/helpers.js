import { getNodeScrollBottomOffset, getNodeScrollLeftOffset, getNodeScrollTopOffset } from 'utils/dom-helpers';
import {
  DISPLAY_TYPE_STATIC_TOP,
  DISPLAY_TYPE_STATIC_BOTTOM,
  DISPLAY_TYPE_FIX_TOP,
  DISPLAY_TYPE_FIX_BOTTOM,
  DISPLAY_TYPE_SEMISTATIC,
} from './constants';

export const nodeHeight = node => node?.clientHeight;
export const windowHeight = () => window.innerHeight;

export const getTopOffset = node => parseInt(getNodeScrollTopOffset(node), 10);
export const getLeftOffset = node => parseInt(getNodeScrollLeftOffset(node), 10);
export const getBottomOffset = (node) => {
  if (!node) return Infinity;
  return parseInt(getNodeScrollBottomOffset(node), 10) - windowHeight();
};

export const isWindowBiggerThanContent = node => windowHeight() >= nodeHeight(node);

export const getIntFromStyleProperty = property => parseInt(property.toString().replace('px', ''), 10);

export const getDefaultBottomOffset = (node) => {
  const { paddingBottom, marginBottom } = getComputedStyle(node);
  const paddingBottomValue = getIntFromStyleProperty(paddingBottom);
  const marginBottomValue = getIntFromStyleProperty(marginBottom);
  return paddingBottomValue + marginBottomValue;
};

/**
 * Function determines how component should be displayed
 * @param contentNode - domNode,
 * @param containerNode - domNode of followContainer container
 * @param offsetTop - number, used for static offset fixed in top
 * @param offsetBottom - number, used for static offset fixed in bottom
 * @param isTopScrolling - true if component was scrolled up, false otherwise
 * @param preventFixLeft - will safe horizontal scroll position
 * @param toBottom - if true, then stick to bottom behavior enabled
 * @returns *{
 *  displayType: position type,
 *  positionTop: top offset in case it is required,
 *  positionBottom: bottom offset in case it is required
 * }
 */
export const getDisplayType = (
  contentNode,
  containerNode,
  offsetTop,
  offsetBottom,
  isTopScrolling,
  toBottom,
  preventFixLeft,
) => {
  const containerBottomOffset = getBottomOffset(containerNode);
  const containerTopOffset = getTopOffset(containerNode);

  const containerLeftOffset = getLeftOffset(containerNode);
  const contentTopOffset = getTopOffset(contentNode);
  const contentBottomOffset = getBottomOffset(contentNode);
  const contentHeight = nodeHeight(contentNode);

  const smallContent = isWindowBiggerThanContent(contentNode);

  const relativeContentBottomOffset = Math.max(0, windowHeight() - contentHeight) + containerBottomOffset;
  /** first we work with to bottom stick behavior */

  if (toBottom && containerBottomOffset <= 0) {
    /** bottom fixed display type, we are scrolling down and node is touching bottom edge of window */
    return {
      displayType: DISPLAY_TYPE_STATIC_BOTTOM,
      positionBottom: offsetTop,
    };
  } else if (toBottom && containerBottomOffset > -offsetTop) {
    return {
      displayType: DISPLAY_TYPE_FIX_BOTTOM,
      positionBottom: offsetTop,
    };
  }

  /** then we work with classic behavior */
  if (containerTopOffset <= -offsetTop) {
    /** static display type, window is above parents top edge */
    return { displayType: DISPLAY_TYPE_STATIC_TOP };
  }

  if (
    (smallContent && relativeContentBottomOffset > offsetBottom + offsetTop) ||
    (isTopScrolling && contentTopOffset <= -offsetTop)
  ) {
    /** top fixed display type, we are scrolling up and node is touching top edge of window */
    return {
      displayType: DISPLAY_TYPE_FIX_TOP,
      positionTop: offsetTop,
      positionLeft: preventFixLeft && window.pageXOffset > 0 ? -containerLeftOffset : null,
    };
  } else if (!isTopScrolling && !smallContent && contentBottomOffset <= -offsetBottom) {
    /** bottom fixed display type, we are scrolling down and node is touching bottom edge of window */
    return {
      displayType: DISPLAY_TYPE_FIX_BOTTOM,
      positionBottom: offsetBottom,
    };
  }
  /** the most complicated display type, neither top, nor bottom, window is between start and end of element */

  return {
    displayType: DISPLAY_TYPE_SEMISTATIC,
    positionTop: containerTopOffset - contentTopOffset,
  };
};

export const getCalculatedWidth = (node) => {
  const { width, paddingLeft, paddingRight } = getComputedStyle(node);
  const widthValue = getIntFromStyleProperty(width);
  const paddingLeftValue = getIntFromStyleProperty(paddingLeft);
  const paddingRightValue = getIntFromStyleProperty(paddingRight);
  // ===
  return widthValue - paddingLeftValue - paddingRightValue;
};
