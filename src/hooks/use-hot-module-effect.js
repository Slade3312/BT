import { useEffect, useRef } from 'react';

// important for react hot reload, because useState don't restore after hot reload
// call only when 'hot' fired (exclude first mount)
export const useHotModuleEffect = (onUpdate) => {
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      onUpdate();
    }
    isMounted.current = true;
  }, ['hot']);
};
