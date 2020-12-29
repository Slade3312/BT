import { filterValuableFormFields } from './fn';

describe('filterValuableFormField', () => {
  it('should process empty object', () => {
    const obj = {};
    expect(filterValuableFormFields(obj)).toEqual({});
  });
  it('should process all existing cases', () => {
    const obj = {
      a: 'Hello',
      b: '',
      c: null,
      d: undefined,
      e: NaN,
      f: {},
      g: [],
      h: { a: 'hello' },
      i: ['hello'],
      j: 0,
      k: 100,
      l: true,
      m: false,
    };
    expect(filterValuableFormFields(obj)).toEqual({
      a: 'Hello',
      h: { a: 'hello' },
      i: ['hello'],
      j: 0,
      k: 100,
      l: true,
      m: false,
    });
  });
});
