import { CHANGE_FORM_VALUES, DESTROY_FORM, INITIALIZE_FORM_VALUES, UPDATE_FORM_VALUES } from './constants';

export const updateFormState = formName => formValues => ({
  type: UPDATE_FORM_VALUES,
  payload: { formName, values: formValues },
});

export const changeFormState = formName => formValues => ({
  type: CHANGE_FORM_VALUES,
  payload: { formName, values: formValues },
});

export const destroyForm = formName => ({
  type: DESTROY_FORM,
  payload: { formName },
});

export const initializeForm = formName => formValues => ({
  type: INITIALIZE_FORM_VALUES,
  payload: { formName, values: formValues },
});
