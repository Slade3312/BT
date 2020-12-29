import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Router, useLocation } from '@reach/router';
import PropTypes from 'prop-types';
import { TINDER_LANDING } from 'pages/constants';
import { PageLoader } from '../components/common/Loaders/components';
import AppLayout from './_AppLayout';

const TinderLanding = lazy(() => import('pages/TinderLanding'));

const RoutesWithoutAuth = props => {
  const [isPrivate, setIsPrivate] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.includes(TINDER_LANDING)) {
      setIsPrivate(true);
      return;
    }
    setIsPrivate(false);
  }, [location.pathname]);

  return (
    <>
      <Suspense fallback={<PageLoader isLoading />}>
        <Router component={AppLayout} basepath="/" primary={false}>
          <TinderLanding path={TINDER_LANDING} />
        </Router>
      </Suspense>
      {
        isPrivate && props.children
      }
    </>
  );
};

RoutesWithoutAuth.propTypes = {
  children: PropTypes.any,
};

export default RoutesWithoutAuth;
