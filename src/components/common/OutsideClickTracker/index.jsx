import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';

import { filterValidAttributes } from 'utils/events';
import withForwardedRef from 'enhancers/withForwardedRef';
import withOutsideClick from 'enhancers/withOutsideClick';


function OutsideClickTracker({ children, forwardedRef, ...otherAttributes }) {
  return (
    <div
      ref={forwardedRef}
      {...filterValidAttributes(otherAttributes)}
    >
      {children}
    </div>
  );
}

OutsideClickTracker.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  forwardedRef: CustomPropTypes.ref,
};


export default withOutsideClick(withForwardedRef(OutsideClickTracker));
