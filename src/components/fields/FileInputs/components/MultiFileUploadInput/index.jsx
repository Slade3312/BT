import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import withForwardedRef from 'enhancers/withForwardedRef';
import { FileUploadInput } from '../../views';

function MultiFileUploadInput({ children, onChange, forwardedRef, ...otherProps }) {
  const handleOnChange = (event) => {
    onChange(event.target.files, event);
  };

  return (
    <FileUploadInput ref={forwardedRef} isMultiple onChange={handleOnChange} {...otherProps}>
      {children}
    </FileUploadInput>
  );
}

MultiFileUploadInput.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  forwardedRef: CustomPropTypes.ref,
};

export default withForwardedRef(MultiFileUploadInput);
