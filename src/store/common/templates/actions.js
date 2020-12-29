import { SET_TEMPLATE } from './constants';

export const setTemplate = (name, data) => ({
  type: SET_TEMPLATE,
  payload: { name, data },
});

export const setTemplateCreator = name => data => setTemplate(name, data);
