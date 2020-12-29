import PropTypes from 'prop-types';
import React from 'react';

const withEditableField = ([WrappedFieldInput, WrappedFieldDisplayText]) => {
  const EditableField = ({
    name,
    isEditable,
    defaultViewText,
    ...otherProps
  }) =>
    (isEditable ? (
      <WrappedFieldInput name={name} {...otherProps} />
    ) : (
      <WrappedFieldDisplayText
        name={name}
        {...{ ...otherProps, defaultViewText }}
      />
    ));

  EditableField.propTypes = {
    name: PropTypes.string,
    isEditable: PropTypes.bool,
    defaultViewText: PropTypes.string,
    placeholder: PropTypes.string,
  };
  return EditableField;
};

export default withEditableField;
