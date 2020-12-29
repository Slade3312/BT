import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { useFormState } from 'react-final-form';

export default function withFieldArray(Component) {
  const ArrayFieldInput = (props) => {
    const {
      fields: { name },
      meta: { error },
    } = props;

    const { touched } = useFormState();
    const isOneChildTouched = useMemo(() => Object.keys(touched).some(key => key.startsWith(name) && touched[key]), [
      touched,
    ]);
    const shouldShowError = isOneChildTouched && error;

    return (
      <Component
        {...props}
        name={name}
        error={shouldShowError ? error : undefined}
        touched={isOneChildTouched}
      />
    );
  };

  ArrayFieldInput.propTypes = {
    fields: PropTypes.shape({
      name: PropTypes.string,
    }),
    meta: PropTypes.shape({
      error: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    }),
  };

  return props => <FieldArray component={ArrayFieldInput} {...props} />;
}
