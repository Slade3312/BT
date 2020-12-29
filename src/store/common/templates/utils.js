import merge from 'deepmerge';
import htmlReactParser from 'html-react-parser';
import { htmlOptions } from 'pages/AudienceStatistic/components/ContactsDescription';

export const deepTemplateTransformByContentType = (template) => {
  if (template && typeof template === 'object') {
    if (Array.isArray(template)) {
      return template.map(deepTemplateTransformByContentType);
    }
    if (template.hasOwnProperty('content')) {
      return (template.type === 'html' && template.content) ? htmlReactParser(String(template.content), htmlOptions) : template.content;
    }
    return Object.keys(template).reduce((acc, nextKey) => ({
      ...acc,
      [nextKey]: deepTemplateTransformByContentType(template[nextKey]),
    }), {});
  }
  return template;
};

const mergeArraysByExistingIndex = (destinationArray, sourceArray) =>
  sourceArray !== undefined ? sourceArray : destinationArray;

export const deepMergeWithArraysByIndex = (objA, objB) =>
  merge(objA, objB, {
    arrayMerge: mergeArraysByExistingIndex,
  });
