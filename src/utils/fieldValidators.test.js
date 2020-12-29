import { composeHttpValidator, composeUrlValidator } from './fieldValidators';

describe('composeUrlValidator', () => {
  it('should check success validation', () => {
    const error = 'error';
    expect(composeUrlValidator(error)('hello.com')).toEqual(undefined);
    expect(composeUrlValidator(error)('hello.ru')).toEqual(undefined);
    expect(composeUrlValidator(error)('www.hello.com')).toEqual(undefined);
    expect(composeUrlValidator(error)('http://hello.com')).toEqual(undefined);
    expect(composeUrlValidator(error)('https://hello.com')).toEqual(undefined);
    expect(composeUrlValidator(error)('https://hello.hello/')).toEqual(undefined);
    expect(composeUrlValidator(error)('https://hello.hello')).toEqual(undefined);
    expect(composeUrlValidator(error)('vk.com/hello')).toEqual(undefined);
    expect(composeUrlValidator(error)('vk.hello/hello/goodbye')).toEqual(undefined);
    expect(composeUrlValidator(error)('vk.com/#hello')).toEqual(undefined);
    expect(composeUrlValidator(error)('https://hey.hello-goodbye.com/')).toEqual(undefined);
    expect(composeUrlValidator(error)('https://hey.hello-goodbye.com/hey-hello-goodbye')).toEqual(undefined);
  });
  it('should check error validation', () => {
    const error = 'error';
    expect(composeUrlValidator(error)('h!ello.com')).toEqual(error);
    expect(composeUrlValidator(error)('www://hello.hello')).toEqual(error);
    expect(composeUrlValidator(error)('http:/hello.com')).toEqual(error);
    expect(composeUrlValidator(error)('htfftps://hello.hello')).toEqual(error);
    expect(composeUrlValidator(error)('https://hello.c!om')).toEqual(error);
    expect(composeUrlValidator(error)('https://hello..hello/')).toEqual(error);
  });
});

describe('composeHttpsValidator', () => {
  it('should check success validation', () => {
    const error = 'error';
    expect(composeHttpValidator(error)('http://hey.hello-goodbye.com/hey-hello-goodbye')).toEqual(undefined);
    expect(composeHttpValidator(error)('https://hey.hello-goodbye.com/hey-hello-goodbye')).toEqual(undefined);
  });
  it('should check error validation', () => {
    const error = 'error';
    expect(composeHttpValidator(error)('www.hello.com')).toEqual(error);
    expect(composeHttpValidator(error)('hello.com')).toEqual(error);
    expect(composeHttpValidator(error)('htp://hello.com')).toEqual(error);
  });
});
