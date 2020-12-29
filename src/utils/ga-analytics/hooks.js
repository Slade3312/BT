import { useRef } from 'react';
import { pushToGA } from 'utils/ga-analytics/data-layer';

export const useOnBlurBlockFieldsGA = (eventProps) => {
  const prevValues = useRef({});
  const handleBlurChanged = (e) => {
    if (!prevValues.current || (e.target.value && prevValues.current[e.target.name] !== e.target.value)) {
      prevValues.current[e.target.name] = e.target.value;
      pushToGA(eventProps);
    }
  };
  return handleBlurChanged;
};
