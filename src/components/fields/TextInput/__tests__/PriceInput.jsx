import React from 'react';
import { mount } from 'enzyme';

import { injectEventHandling } from 'testUtils/advancedEventHandling';
import { StatefulPriceInput } from '../index';


const setupTest = () => {
  const testFn = jest.fn();
  const component = mount(<StatefulPriceInput onChange={testFn} />);

  const input = component.find('input');
  injectEventHandling(input);
  const domNode = input.instance();

  input.simulate('keyboard', { keys: ['1', '2', '3', '4', '5'] });

  return { testFn, input, domNode };
};


describe('PriceInput', () => {
  // console.log = () => {};
  // console.assert = () => {};
  it('Should enter value properly', () => {
    const { domNode } = setupTest();
    expect(domNode.value).toEqual('12 345');
  });

  describe('Inserting digits', () => {
    const shouldInsertDigitAt = (caretPos, endCaretPos = caretPos) => (expectedCaretPos, expectedResult) => {
      it(`Should insert digit at ${caretPos}${caretPos !== endCaretPos ? ` ${endCaretPos}` : ''}`, () => {
        const { input, domNode } = setupTest();

        domNode.setSelectionRange(caretPos, endCaretPos);
        input.simulate('keypress', { key: '6' });

        expect([domNode.selectionStart, domNode.selectionEnd]).toEqual([expectedCaretPos, expectedCaretPos]);
        expect(domNode.value).toEqual(expectedResult);
      });
    };

    /**
     * with `12 345`, test inserting `6` at position defined by index
     */
    shouldInsertDigitAt(0)(1, '612 345');
    shouldInsertDigitAt(1)(2, '162 345');
    shouldInsertDigitAt(2)(3, '126 345');
    shouldInsertDigitAt(3)(3, '126 345');
    shouldInsertDigitAt(4)(5, '123 645');
    shouldInsertDigitAt(5)(6, '123 465');
    shouldInsertDigitAt(6)(7, '123 456');
  });

  describe('Backspace', () => {
    const shouldEraseDigitsAt = (caretPos, endCaretPos = caretPos) => (expectedCaretPos, expectedResult) => {
      it(`Should erase digit at ${caretPos}${caretPos !== endCaretPos ? ` ${endCaretPos}` : ''}`, () => {
        const { input, domNode } = setupTest();

        domNode.setSelectionRange(caretPos, endCaretPos);
        input.simulate('keypress', { key: 'Backspace' });

        expect(domNode.value).toEqual(expectedResult);
        expect([domNode.selectionStart, domNode.selectionEnd]).toEqual([expectedCaretPos, expectedCaretPos]);
      });
    };

    /**
     * with `12 345`, test erasing one symbol with backspace at position defined by index
     */
    shouldEraseDigitsAt(0)(0, '12 345');
    shouldEraseDigitsAt(1)(0, '2 345');
    shouldEraseDigitsAt(2)(1, '1 345');
    shouldEraseDigitsAt(3)(1, '1 345');
    shouldEraseDigitsAt(4)(3, '1 245');
    shouldEraseDigitsAt(5)(4, '1 235');
    shouldEraseDigitsAt(6)(5, '1 234');
  });
});
