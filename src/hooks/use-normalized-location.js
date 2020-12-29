import { useLocation } from '@reach/router';
import { normalizeEndOfUrl } from 'utils/router';

export const useNormalizedLocation = () => {
  const location = useLocation();
  return { ...location, pathname: normalizeEndOfUrl(location.pathname) };
};
