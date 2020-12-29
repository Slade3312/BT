import React, { Suspense } from 'react';
import { useInitialPageData } from 'hooks/use-initial-page-data';
import { PageLoader } from 'components/common/Loaders/components';

const withPageInitializator = loadPageModule => (initializeRequestsConfig) => {
  const LazyComponent = React.lazy(loadPageModule);

  const PageInitializator = (props) => {
    const isInitializePassed = useInitialPageData(initializeRequestsConfig);

    return isInitializePassed ? (
      <Suspense fallback={<PageLoader isLoading />}>
        <LazyComponent {...props} />
      </Suspense>
    ) : (
      <PageLoader isLoading />
    );
  };
  return PageInitializator;
};

export default withPageInitializator;
