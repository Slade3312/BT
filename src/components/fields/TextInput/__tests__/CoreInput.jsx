import React from 'react';
import { mount } from 'enzyme';
import { injectEventHandling } from 'testUtils/advancedEventHandling';
import { CoreInput } from '../index';
import withState from '../enhancers/withState';

const StatefulCoreInput = withState(CoreInput);


const setupTest = (initialValue, enteredValue = '', trimInitialValue = false) => {
  const testFn = jest.fn();
  const component = mount(<StatefulCoreInput
    onChange={testFn}
    value={initialValue || ''}
    trimInitialValue={trimInitialValue}
    isClearable
  />);

  const input = component.find('input');
  injectEventHandling(input);
  const domNode = input.instance();
  domNode.setSelectionRange(initialValue.length, initialValue.length);
  input.simulate('keyboard', { keys: enteredValue.split('') });
  const icon = component.find('button');

  return { input, domNode, icon, testFn };
};


describe('CoreInput', () => {
  // console.log = () => {};
  // console.assert = () => {};
  it('Should enter value properly', () => {
    const { domNode } = setupTest('qwerty123');
    expect(domNode.value).toEqual('qwerty123');
  });

  describe('Enter and clear value', () => {
    const shouldCleanValue = (initialValue, enteredValue) => {
      initialValue = initialValue || '';
      enteredValue = enteredValue || '';
      it(`Should clean value '${initialValue}' after entering '${enteredValue}'`, () => {
        const { icon, domNode, testFn } = setupTest(initialValue, enteredValue);
        expect(domNode.value).toEqual(initialValue + enteredValue);
        expect(testFn.mock.calls.map(([a]) => a)).toMatchSnapshot();
        icon.simulate('click');
        expect(domNode.value).toEqual('');
      });
    };

    /** test initial value */
    shouldCleanValue('1');
    shouldCleanValue('q ');
    shouldCleanValue('qw ');

    /** test changed value */
    shouldCleanValue(null, 'q');
    shouldCleanValue(null, 'q ');
    shouldCleanValue(null, 'qw ');

    /** test mixed value */
    shouldCleanValue('q', ' w');
    shouldCleanValue(' sq', ' we ');
    shouldCleanValue('qw', ' e ');
    shouldCleanValue(' qw', ' e ');
  });
});
