import PropTypes from 'prop-types';
import {
  Location,
  LocationProvider as ReachLocationProvider,
} from '@reach/router';
import React from 'react';
import { LocationContext } from './context';

const LocationProvider = ({ children, ...props }) => (
  <ReachLocationProvider {...props}>
    <Location>
      {locationProps => (
        <LocationContext.Provider value={locationProps}>
          {children}
        </LocationContext.Provider>
      )}
    </Location>
  </ReachLocationProvider>
);

LocationProvider.propTypes = {
  children: PropTypes.node,
};

export default LocationProvider;
