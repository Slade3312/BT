const KEYBOARD_BACKSPACE_KEYCODE = 8;


/**
 * Inject the following into enzyme node:
 * - keypress, and keyboard events that change input value,
 *   manipulate selection and call keydown, keyup, change
 * - selectionStart, selectionEnd and setSelectionRange
 *
 * Usage:
 * ----
 * const component = mount(...);
 * const input = component.find('input');
 * injectEventHandling(input);
 * input.simulate('keypress', { key: 'a' });
 * input.simulate('keypress', { key: 'Backspace' });
 * input.simulate('keyboard', { keys: ['b', 'c', 'Backspace', 'e' ] });
 *
 * Note:
 * ----
 * This module does not exactly reproduce the default browser behavior,
 * it is simply a close approximation with limited functionality
 *
 * Amongst limitations - async nature of cursor position management
 */
export const injectEventHandling = (testNode) => {
  const originalSimulate = testNode.simulate;

  const domNode = testNode.instance();
  Object.defineProperty(domNode, 'selectionStart', {
    writable: true,
    value: 0,
  });
  Object.defineProperty(domNode, 'selectionEnd', {
    writable: true,
    value: 0,
  });

  Object.defineProperty(domNode, 'setSelectionRange', {
    writable: true,
    value: (selectionStart, selectionEnd) => {
      console.assert(
        selectionStart >= 0 && selectionEnd >= selectionStart && selectionEnd <= domNode.value.length,
        'Attempting to call setSelectionRange with improper interval',
      );

      domNode.selectionStart = selectionStart;
      domNode.selectionEnd = selectionEnd;
    },
  });

  testNode.simulate = (eventType, event, ...args) => {
    if (eventType === 'keyboard') {
      /** shortcut event type for user input simulation */
      const { keys } = event;

      keys.forEach(key => testNode.simulate('keypress', { key }));
    } else if (eventType === 'keypress') {
      /** smart keypress, supporting different keys as well as cursor movement */
      let preventDefault;
      event.preventDefault = () => { preventDefault = true; };
      if (event.key === 'Backspace') event.keyCode = KEYBOARD_BACKSPACE_KEYCODE;

      originalSimulate.call(testNode, 'keydown', event, ...args);
      /** must read instance after keydown, otherwise we miss out on changes done by keydown */
      let { value } = testNode.instance();

      switch (event.key) {
        case 'Backspace':
          /**
           * Handles three possible cases for backspace:
           * 1. if selection is empty and we are at start - we do nothing
           * 2. if selection is empty and we are not at start - we erase one symbol backwards
           * 3. if selection is not empty, we erase selection
           */
          if (domNode.selectionStart === domNode.selectionEnd && domNode.selectionStart > 0) {
            domNode.selectionStart -= 1;
          }

          value = value.slice(0, domNode.selectionStart) + value.slice(domNode.selectionEnd);
          domNode.value = value;
          domNode.setSelectionRange(domNode.selectionStart, domNode.selectionStart);

          if (!preventDefault) {
            testNode.simulate('change', { target: { value } });
          }
          break;
        default:
          /** otherwise we just enter a key */
          value = value.slice(0, domNode.selectionStart) + event.key + value.slice(domNode.selectionEnd);
          domNode.value = value;
          domNode.setSelectionRange(domNode.selectionStart + 1, domNode.selectionStart + 1);


          if (!preventDefault) {
            originalSimulate.call(testNode, 'change', { target: { value } });
          }
          break;
      }
      originalSimulate.call(testNode, 'keypress', event, ...args);
      originalSimulate.call(testNode, 'keyup', event, ...args);

      /**
       * this is default react behavior: if expected value doesn't match actual value,
       * aka onChange modifies field - we reset cursor position to last symbol
       */
      // if (value !== domNode.value) {
      //   console.log('BREAK ALL TO ASHES')
      //   domNode.setSelectionRange(domNode.value.length, domNode.value.length);
      // }
    } else if (eventType === 'paste') {
      let { value } = testNode.instance();

      value = value.slice(0, domNode.selectionStart) + event._value + value.slice(domNode.selectionEnd);
      domNode.value = value;
      const nextCursorPos = domNode.selectionStart + event._value.length;
      domNode.setSelectionRange(nextCursorPos, nextCursorPos);

      originalSimulate.call(testNode, 'change', { target: { value } });
    }

    /** keyboard is our abstract event, no propagation needed */
    if (eventType !== 'keyboard' && eventType !== 'paste') {
      originalSimulate.call(testNode, eventType, event, ...args);
    }
  };
};
