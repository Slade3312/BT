import { filter } from 'utils/fn';


export const mouseEvents = [
  'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop',
  'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp',
  'onClick', 'onContextMenu', 'onDoubleClick',
];

export const touchEvents = [
  'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart',
];

export const commonProps = [
  'style', 'className', 'dangerouslySetInnerHTML',
];

export const allAllowedProps = [
  ...mouseEvents,
  ...touchEvents,
  ...commonProps,
];


/**
 * check if all keys in props are valid events by name
 * @type {function(*=): boolean}
 */
export const assertAllowedProps = (props) => {
  const incorrectEventHandlers = Object.keys(props).filter(item => allAllowedProps.indexOf(item) === -1);
  console.assert(
    !incorrectEventHandlers.length,
    `Event Handlers Must be existing events, \`${incorrectEventHandlers.join(', ')}\` found`,
  );
};


export const filterValidAttributes = props => filter(props, (_, key) => allAllowedProps.indexOf(key) !== -1);


/**
 *  stop delegating event down over tree
 * @param e - browser events
 */

export const stopPropagation = e => e.stopPropagation();
export const preventDefault = e => e.preventDefault();
