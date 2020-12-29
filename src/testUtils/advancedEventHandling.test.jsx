import React from 'react';
import { mount } from 'enzyme';
import { injectEventHandling } from './advancedEventHandling';

const setupTest = () => {
  const testFn = jest.fn();
  const component = mount(<input type="text" onChange={({ target: { value } }) => testFn(value)} />);

  const input = component.find('input');
  injectEventHandling(input);
  const domNode = input.instance();
  return { testFn, component, input, domNode };
};

const setupBackspaceTest = async () => {
  const { input, domNode } = setupTest();
  await input.simulate('keyboard', { keys: ['1', '2', '3', '4', '5'] });
  return { input, domNode };
};

describe('AdvancedEventHandling', () => {
  describe('Keyboard events', () => {
    it('should fire with 1', async () => {
      const { testFn, input, domNode } = setupTest();

      await input.simulate('keypress', { key: '1' });
      expect([domNode.selectionStart, domNode.selectionEnd]).toEqual([1, 1]);
      expect(testFn).toHaveBeenLastCalledWith('1');
      expect(domNode.value).toEqual('1');
    });

    it('should fire with 12', async () => {
      const { testFn, input, domNode } = setupTest();

      await input.simulate('keyboard', { keys: ['1', '2'] });
      expect([domNode.selectionStart, domNode.selectionEnd]).toEqual([2, 2]);
      expect(testFn).toHaveBeenLastCalledWith('12');
      expect(domNode.value).toEqual('12');
    });

    it('should fire with 123', async () => {
      const { testFn, input, domNode } = setupTest();

      await input.simulate('keyboard', { keys: ['1', '2', '3'] });
      expect([domNode.selectionStart, domNode.selectionEnd]).toEqual([3, 3]);
      expect(testFn).toHaveBeenLastCalledWith('123');
      expect(domNode.value).toEqual('123');
    });
  });

  describe('Backspace', () => {
    it('Should enter value properly', async () => {
      const { domNode } = await setupBackspaceTest();
      expect(domNode.value).toEqual('12345');
    });

    it('Erase first symbol', async () => {
      const { input, domNode } = await setupBackspaceTest();
      domNode.setSelectionRange(1, 1);
      await input.simulate('keypress', { key: 'Backspace' });
      expect([domNode.selectionStart, domNode.selectionEnd]).toEqual([0, 0]);
      expect(domNode.value).toEqual('2345');
    });

    it('Erase second symbol', async () => {
      const { input, domNode } = await setupBackspaceTest();
      domNode.setSelectionRange(2, 2);
      await input.simulate('keypress', { key: 'Backspace' });
      expect([domNode.selectionStart, domNode.selectionEnd]).toEqual([1, 1]);
      expect(domNode.value).toEqual('1345');
    });

    it('Erase third symbol', async () => {
      const { input, domNode } = await setupBackspaceTest();
      domNode.setSelectionRange(3, 3);
      await input.simulate('keypress', { key: 'Backspace' });
      expect([domNode.selectionStart, domNode.selectionEnd]).toEqual([2, 2]);
      expect(domNode.value).toEqual('1245');
    });
  });
});
