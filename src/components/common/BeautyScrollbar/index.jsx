import React from 'react';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';

function BeautyScrollbar({ children, forwardedRef, className, onScroll, ...otherProps }) {
  return (
    <SimpleBar
      className={className}
      scrollableNodeProps={{ ref: forwardedRef, onScroll }}
      {...otherProps}
    >
      {children}
    </SimpleBar>
  );
}

BeautyScrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  forwardedRef: CustomPropTypes.ref,
  onScroll: PropTypes.func,
};

export default withForwardedRef(BeautyScrollbar);
