import { useEffect } from 'react';
import { useNormalizedLocation } from 'hooks/use-normalized-location';
import { scrollSmoothToNodeById } from 'utils/scroll';

export const useLocationScrollController = () => {
  const location = useNormalizedLocation();
  useEffect(() => {
    if (location.hash) {
      scrollSmoothToNodeById(location.hash.slice(1));
    }
  }, [location]);
};
