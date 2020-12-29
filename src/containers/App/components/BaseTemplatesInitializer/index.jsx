import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import getErrorTemplates from 'store/common/templates/errors/requests';
import Templates from 'store/mobx/Templates';
import { PageLoader } from 'components/common/Loaders/components';

const BaseTemplatesInitializer = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async function initialLoading() {
      try {
        await Promise.all([
          getErrorTemplates(dispatch),
          Templates.getTemplate('common'),
        ]);
      } finally {
        setLoaded(true);
      }
    }());
  }, []);

  if (!loaded) {
    return <PageLoader isLoading />;
  }

  return children;
};

export default BaseTemplatesInitializer;
