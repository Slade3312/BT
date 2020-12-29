import { deepMergeWithArraysByIndex, deepTemplateTransformByContentType } from './utils';

describe('deepMergeOverwriteArrays', () => {
  it('should merge by source object in priority to target', () => {
    const target = { a: 10, c: 30 };
    const source = { a: 20, b: 10 };
    const result = { a: 20, b: 10, c: 30 };
    expect(deepMergeWithArraysByIndex(target, source)).toEqual(result);
  });
  it('should merge keys if source value by the key is undefined', () => {
    const target = { a: { h: 'hello' } };
    const source = { a: null, b: 10 };
    const result = { a: null, b: 10 };
    expect(deepMergeWithArraysByIndex(target, source)).toEqual(result);
  });
  it('should merge arrays by overwrite strategy from source array', () => {
    const target = { b: [{ a: 1, b: 2 }, { a: 3, b: 4 }] };
    const source = { b: [{ a: null }, { a: null, b: 11 }] };
    const result = { b: [{ a: null }, { a: null, b: 11 }] };
    expect(deepMergeWithArraysByIndex(target, source)).toEqual(result);
  });
  it('all above should work for any level of depth', () => {
    const target = { a: { b: { e: { a: 1, b: 2 } }, f: [1, 2, 3] } };
    const source = { a: { b: { e: { a: null, c: 3 } }, j: [4, 5, 6] } };
    const result = { a: { b: { e: { a: null, b: 2, c: 3 } }, f: [1, 2, 3], j: [4, 5, 6] } };
    expect(deepMergeWithArraysByIndex(target, source)).toEqual(result);
  });
});

describe('deepTemplateTransformByContentType', () => {
  it('should return source data for primitives', () => {
    expect(deepTemplateTransformByContentType(0)).toEqual(0);
    expect(deepTemplateTransformByContentType(10)).toEqual(10);
    expect(deepTemplateTransformByContentType('')).toEqual('');
    expect(deepTemplateTransformByContentType('Hello')).toEqual('Hello');
    expect(deepTemplateTransformByContentType(null)).toEqual(null);
    expect(deepTemplateTransformByContentType(undefined)).toEqual(undefined);
  });
  it('should return source data for base cases with objects', () => {
    expect(deepTemplateTransformByContentType({})).toEqual({});
    expect(deepTemplateTransformByContentType([])).toEqual([]);
    expect(deepTemplateTransformByContentType([1, 2, 3])).toEqual([1, 2, 3]);
  });
  it('should return source data', () => {
    const source = { a: { b: 'Hello' }, c: 30, f: [{ a: 'hello', b: 10 }] };
    const result = { a: { b: 'Hello' }, c: 30, f: [{ a: 'hello', b: 10 }] };
    expect(deepTemplateTransformByContentType(source)).toEqual(result);
  });
  it('should simplify object fields with content property without "type" key', () => {
    const source = { a: { content: 'Hello' }, c: 30, f: [{ a: { content: 'Hello' } }] };
    const result = { a: 'Hello', c: 30, f: [{ a: 'Hello' }] };
    expect(deepTemplateTransformByContentType(source)).toEqual(result);
  });
  it('should check that null type is proceed as expected', () => {
    const source = {
      SomeComponent: {
        title: {
          content: null,
          type: 'string',
        },
        description: {
          content: null,
          type: 'html',
        },
        icon: {
          content: 'https://somelongurl.ru',
          type: 'string',
        },
      },
    };

    const result = {
      SomeComponent: {
        description: null,
        icon: 'https://somelongurl.ru',
        title: null,
      },
    };

    expect(deepTemplateTransformByContentType(source)).toEqual(result);
  });
  // TODO write test when content receive React node when type is 'html'
});
