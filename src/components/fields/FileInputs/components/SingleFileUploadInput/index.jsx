import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import withForwardedRef from 'enhancers/withForwardedRef';
import { FileUploadInput } from '../../views';

function SingleFileUploadInput({ children, forwardedRef, onChange, ...otherProps }) {
  const handleOnChange = (event) => {
    onChange(event.target.files[0]);
    // to allow call onChange callback after selected same file, we reset current value
    // because our logic is required onChange callback
    forwardedRef.current.value = '';
  };

  return <FileUploadInput onChange={handleOnChange} ref={forwardedRef} {...otherProps}>{children}</FileUploadInput>;
}

SingleFileUploadInput.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  forwardedRef: CustomPropTypes.ref,
};

export default withForwardedRef(SingleFileUploadInput);
