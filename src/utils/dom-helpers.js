import React from 'react';
import { position } from 'caret-pos';
import { escapeStringRegexp } from './fn';

const isSupportGetBoundingClientRect = node =>
  !(typeof node !== 'object' || node === null || !('getBoundingClientRect' in node));

/**
 * calculate offset from node, to current scrollTop of the window
 * @param node - DOM node
 * @returns number of pixels from window top edge, negative if left behind scroll, null on error
 */

export const getNodeScrollTopOffset = (node) => {
  if (!isSupportGetBoundingClientRect(node)) return null;
  return 0 - node.getBoundingClientRect().top;
};

export const getNodeScrollBottomOffset = (node) => {
  if (!isSupportGetBoundingClientRect(node)) return null;
  return node.getBoundingClientRect().bottom;
};

export const getNodeScrollLeftOffset = (node) => {
  if (!isSupportGetBoundingClientRect(node)) return null;
  return 0 - node.getBoundingClientRect().left;
};

export const getNodeById = nodeId => document.getElementById(nodeId);

export const getAttrValueFromNodeTemplate = (template, attrName) => {
  const regExp = new RegExp(`${escapeStringRegexp(attrName)}="(.[^"]+)"`, 'i');
  const parsedAttr = template.match(regExp);

  if (parsedAttr) {
    return parsedAttr[1];
  }
  return null;
};

export function pasteHtmlAtCaret(html) {
  let sel;
  let range;

  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();

      // Range.createContextualFragment() would be useful here but is
      // only relatively recently standardized and is not supported in
      // some browsers (IE9, for one)
      const el = document.createElement('div');
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node;
      let lastNode;
      // eslint-disable-next-line no-cond-assign
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type !== 'Control') {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
}

export const getCaretPosition = node => position(node).pos;
export const setCaretPosition = (node, pos) => position(node, pos);

/*
  check that element is valid react element or react node,
  if passed nodes then check at least one react node is valid
*/
export const isValidReactElement = (elem) => {
  if (typeof elem === 'object') {
    if (Array.isArray(elem) && elem.some(el => React.isValidElement(el))) {
      return true;
    }
    return React.isValidElement(elem);
  }
  return false;
};
