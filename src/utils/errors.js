import { passAsIs } from 'utils/fn';

export const throwNonBlockingError = error => setTimeout(() => {
  throw error instanceof Error ? error : new Error(error);
});

const getErrorText = (title, description) => {
  return [title, description].filter(passAsIs).join('.\n');
};

// extract any first error (field error or non_field_error)
// error can be {any_error_key: ["..."], ...} or {any_error_key: "...", ...}
export const extractError = (errorObj) => {
  const errorData = errorObj?.response?.data || {};

  const errorKey = Object.keys(errorData)[0];
  if (errorKey && errorKey === 'detail') {
    return {
      title: 'Что-то пошло не так',
      description: '',
      fullText: '',
    };
  }

  if (errorKey) {
    const errorBody = errorData[errorKey];
    const firstErrorText = Array.isArray(errorBody) ? errorBody[0] : errorBody;
    const errorParts = String(firstErrorText).split('.');
    const title = errorParts[0];
    const description = errorParts
      .slice(1)
      .join('.')
      .slice(1);

    return {
      title,
      description,
      fullText: getErrorText(title, description),
    };
  }

  return { title: '', description: '', fullText: '' };
};
