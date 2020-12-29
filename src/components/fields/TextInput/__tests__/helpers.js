import assert from 'assert';

import { getPositionOfOccurrence } from '../enhancers/helpers';

console.assert = assert;

describe('helpers', () => {
  describe('getPositionOfOccurrence', () => {
    it('Should find position of 1st occurrence', () =>
      expect(getPositionOfOccurrence('_ ___', '_', 0)).toEqual(0)); //  'o ___'
    it('Should find position of 2nd occurrence', () =>
      expect(getPositionOfOccurrence('_ ___', '_', 1)).toEqual(2)); //  '_ o__'
    it('Should find position of 3rd occurrence', () =>
      expect(getPositionOfOccurrence('_ ___', '_', 2)).toEqual(3)); //  '_ _o_'
    it('Should find position of 4th occurrence', () =>
      expect(getPositionOfOccurrence('_ ___', '_', 3)).toEqual(4)); //  '_ __o'
    it('Should return -1 for 5th occurrence', () =>
      expect(getPositionOfOccurrence('_ ___', '_', 4)).toEqual(-1)); // '_ ___' x
    it('Should return -1 for 6th occurrence', () =>
      expect(getPositionOfOccurrence('_ ___', '_', 5)).toEqual(-1)); // '_ ___' xx
  });
});
