import { useCallback } from 'react';
import { useFormState } from 'react-final-form';
import { scrollSmoothTo } from 'utils/scroll';
import { DISTANCE_TO_NEAREST_ERROR_FIELD } from '../constants';

export const useScrollToInvalid = (formAnchorNode) => {
  const { errors } = useFormState();

  return useCallback(() => {
    const form = formAnchorNode.tagName === 'FORM' ? formAnchorNode : formAnchorNode.closest('form');

    const formFields = form.querySelectorAll('[name]');

    let firstInvalidField = null;
    formFields.forEach((node) => {
      if (!firstInvalidField && errors[node.getAttribute('name')]) {
        firstInvalidField = node;
      }
    });

    if (firstInvalidField) {
      const offsetY = firstInvalidField.getBoundingClientRect().top + pageYOffset - DISTANCE_TO_NEAREST_ERROR_FIELD;

      scrollSmoothTo(offsetY);
    }
  }, [errors, formAnchorNode]);
};
