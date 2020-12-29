/**
 * Returns position of caret on given input element `domNode`
 * @param domNode {HTMLInputElement} - input element that we read cursor position from
 */
export const getCursorPosition = (domNode) => {
  let iCaretPos = 0;

  if (document.selection) {
    domNode.focus();
    const oSel = document.selection.createRange();
    oSel.moveStart('character', -domNode.value.length);
    iCaretPos = oSel.text.length;
  } else if (domNode.selectionStart || domNode.selectionStart === '0') {
    iCaretPos = domNode.selectionStart;
  }
  return iCaretPos;
};

export const getCursorSelectionLength = (domNode) => {
  let selLength = 0;

  if (document.selection) {
    domNode.focus();
    const oSel = document.selection.createRange();
    selLength = oSel.text.length;
  } else if (typeof domNode.selectionStart === 'number' || domNode.selectionStart === '0') {
    selLength = domNode.selectionEnd - domNode.selectionStart;
  }
  return selLength;
};

/**
 * Given input element `domNode`, sets caret on `caretPos`
 * @param domNode {HTMLInputElement} - input element that we set cursor on
 * @param caretPos {number} - position of caret to set cursor on
 */
export const setCursorPosition = (domNode, caretPos) => {
  if (typeof caretPos === 'undefined') return;

  if (domNode.createTextRange) {
    const range = domNode.createTextRange();
    range.move('character', caretPos);
    range.select();
  } else if (domNode.setSelectionRange) {
    domNode.setSelectionRange(caretPos, caretPos);
  }
};


/**
 * Find position of `needle`'s `number` occurrence in `haystack`
 * @param haystack {Array} - string to conduct search in
 * @param needle {string} - a string to search for
 * @param number {number} - occurrence number, starting from 0 (first)
 */
export const getPositionOfOccurrence = (haystack, needle, number) => {
  let position = -1;
  do {
    position = haystack.indexOf(needle, position + 1);
    number -= 1;
  } while (position !== -1 && number >= 0);
  return position;
};


/**
 * fake event is used to imitate onChange-compatible events
 */
export const fakeChangeEvent = (event, value) => ({
  ...event,
  target: {
    ...event.target,
    value,
  },
});
