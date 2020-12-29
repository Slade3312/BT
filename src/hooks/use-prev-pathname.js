import { useEffect, useRef } from 'react';
import { useNormalizedLocation } from './use-normalized-location';

export const usePrevPathname = () => {
  const location = useNormalizedLocation();
  const prevPathname = useRef(null);

  const curPathname = location.pathname;

  useEffect(() => {
    prevPathname.current = curPathname;
  }, [location]);

  return { prevPathname: prevPathname.current, curPathname };
};
