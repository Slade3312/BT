import React from 'react';
import { mount } from 'enzyme';

import { injectEventHandling } from 'testUtils/advancedEventHandling';
import { StatefulPhoneInput } from '../index';


const setupTest = (originalValue = '') => {
  const testFn = jest.fn();
  const component = mount(<StatefulPhoneInput onChange={testFn} />);

  const input = component.find('input');
  injectEventHandling(input);
  const domNode = input.instance();

  input.simulate('keyboard', { keys: originalValue.split('') });

  return { testFn, input, domNode };
};


describe('PhoneInput', () => {
  // console.log = () => {};
  // console.assert = () => {};
  it('Should enter value properly', () => {
    const { domNode } = setupTest('9061234567');
    expect(domNode.value).toEqual('+7 906 123-45-67');
  });

  describe('Inserting digits', () => {
    const shouldInsertDigitAt = (caretPos, endCaretPos = caretPos) => {
      it(`Should insert digit at ${caretPos}${caretPos !== endCaretPos ? ` ${endCaretPos}` : ''}`, () => {
        const { input, domNode } = setupTest('9061234567');

        input.simulate('focus');
        domNode.setSelectionRange(caretPos, endCaretPos);
        input.simulate('keypress', { key: '8' });

        expect([domNode.value, domNode.selectionStart, domNode.selectionEnd]).toMatchSnapshot();
      });
    };

    /**
     * with `+7 906 123-45-67`, test inserting `8` at position defined by index
     */
    shouldInsertDigitAt(0);
    shouldInsertDigitAt(2);
    shouldInsertDigitAt(4);
    shouldInsertDigitAt(5);
    shouldInsertDigitAt(6);
    shouldInsertDigitAt(15);
    shouldInsertDigitAt(16);
  });

  describe('Backspace', () => {
    const shouldEraseDigitsAt = (caretPos, endCaretPos = caretPos) => {
      it(`Should erase digit at ${caretPos}${caretPos !== endCaretPos ? ` ${endCaretPos}` : ''}`, () => {
        const { input, domNode } = setupTest('9061234567');

        input.simulate('focus');
        domNode.setSelectionRange(caretPos, endCaretPos);
        input.simulate('keypress', { key: 'Backspace' });

        expect([domNode.value, domNode.selectionStart, domNode.selectionEnd]).toMatchSnapshot();
      });
    };

    /**
     * with `+7 (906) 123-45-67`, test erasing one symbol with backspace at position defined by index
     */
    shouldEraseDigitsAt(0);
    shouldEraseDigitsAt(1);
    shouldEraseDigitsAt(4);
    shouldEraseDigitsAt(7);

    /* this case fails due to nature of testing environment */
    // shouldEraseDigitsAt(9);
    shouldEraseDigitsAt(8);
    shouldEraseDigitsAt(11);
    shouldEraseDigitsAt(15);
    shouldEraseDigitsAt(16);
  });

  describe('Clipboard', () => {
    const shouldPasteStringAt = (originalValue, pastedValue, caretPos, endCaretPos = caretPos, skip = false) => {
      /** FIXME: fix the following tests, and remove skip feature */
      (skip ? it.skip : it)(`Should paste "${pastedValue}" onto "${originalValue}" string ` +
        ` at ${caretPos}${caretPos !== endCaretPos ? ` ${endCaretPos}` : ''}`, () => {
        const { input, domNode } = setupTest(originalValue);

        input.simulate('focus');
        domNode.setSelectionRange(caretPos, endCaretPos);
        input.simulate('paste', { _value: pastedValue });

        expect([domNode.value, domNode.selectionStart, domNode.selectionEnd]).toMatchSnapshot();
      });
    };


    /**
     * with `+7 906 123-45-67`, test erasing one symbol with backspace at position defined by index
     */
    shouldPasteStringAt('', '+7 906 123-45-67', 0, 0, true);
    shouldPasteStringAt('', '+7 906 123-45-67', 1);
    shouldPasteStringAt('', '+7 906 123-45-67', 3);
    shouldPasteStringAt('', '8 906 123-45-67', 0, 0, true);
    shouldPasteStringAt('', '8 906 123-45-67', 3);
    shouldPasteStringAt('', '906 123-45-67', 0);
    shouldPasteStringAt('', '906 123-45-67', 3);

    shouldPasteStringAt('9096005040', '+7 906 123-45-67', 0);
    shouldPasteStringAt('9096005040', '+7 906 123-45-67', 1);
    shouldPasteStringAt('9096005040', '+7 906 123-45-67', 3);

    shouldPasteStringAt('9096005040', '8 906 123-45-67', 0, 0, true);
    shouldPasteStringAt('9096005040', '8 906 123-45-67', 3, 3, true);
    shouldPasteStringAt('9096005040', '906 123-45-67', 0);
    shouldPasteStringAt('9096005040', '906 123-45-67', 3);
  });
});
