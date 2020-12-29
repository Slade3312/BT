import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import CustomPropTypes from 'utils/prop-types';
import { flatten, filter, shallowEqual } from 'utils/fn';
import { composeFormValidator } from 'utils/fieldValidators';
import { ignoreState } from 'utils/decorators';

export default class FinalForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      values: props.values,
    };
    this.memory = { valid: null };
  }

  static getDerivedStateFromProps = ignoreState((nextProps, prevState) => {
    if (!shallowEqual(nextProps.values, prevState.values)) {
      return {
        values: nextProps.values,
      };
    }
    return null;
  });

  handleChange = ({ values }) => {
    const { onChange, onFormChangeProxy } = this.props;

    const proxyValues = onFormChangeProxy ? onFormChangeProxy(values) : values;

    if (!shallowEqual(proxyValues, this.state.values)) {
      this.setState({ values: proxyValues }, () => onChange(proxyValues));
    }
  };

  handleValidChange = ({ hasValidationErrors }) => {
    const { onValidChange } = this.props;
    const valid = !hasValidationErrors;
    if (valid !== this.memory.valid) onValidChange(valid);
    this.memory.valid = valid;
  };

  handleSubmit = (values) => {
    const { onSubmit } = this.props;

    if (onSubmit) {
      return onSubmit(values)
        .then(() => null)
        .catch(errors => this.handleErrors(errors));
    }

    return null;
  };

  /**
   * Separate validation Errors from global errors
   * @returns {[{object validationErrors}, {array globalErrors}]}
   */
  separateValidationErrors = (errors) => {
    const { getValidators } = this.props;
    const validators = getValidators && getValidators() || {};

    const validationErrors = filter(errors, (value, key) => typeof validators[key] !== 'undefined');
    const globalErrors = filter(errors, (value, key) => typeof validators[key] === 'undefined');

    return [validationErrors, flatten(Object.values(globalErrors))];
  };

  /**
   * There are two types of errors:
   * - validation errors - that are listed in getValidators are returned under field name and passed into fields
   * - all the other errors, passed into `errors` field and thrown by FinalForm onError callback
   */
  handleErrors = (errors) => {
    const { onError } = this.props;

    if (typeof errors === 'object' && errors !== null) {
      const [fieldValidationErrors, otherGlobalErrors] = this.separateValidationErrors(errors);

      if (otherGlobalErrors.length) {
        onError(otherGlobalErrors);
      }

      return {
        ...fieldValidationErrors,
        errors: otherGlobalErrors,
      };
    }
    return null;
  };

  render() {
    const {
      onChange,
      onValidChange,
      children,
      className,
      getValidators,
      domNodeRef,
      id,
      // omit 'values' to prevent FinalForm bug/error "Cannot set property values of #<Object> which has only a getter"
      values: ffPassedValues,
      ...otherFormProps
    } = this.props;

    const { values } = this.state;
    return (
      <Form
        {...otherFormProps}
        // TODO: please change this logic to normal way !) values must not be bound with initialValues upright
        // usually initialValues it's just initialValues
        initialValues={values}
        validate={getValidators ? composeFormValidator(getValidators) : null}
        onSubmit={this.handleSubmit}
        mutators={{
          ...arrayMutators,
        }}
        render={({ handleSubmit }) => (
          <form id={id} onSubmit={handleSubmit} className={className} noValidate ref={domNodeRef}>
            {onChange && <FormSpy subscription={{ values: true }} onChange={this.handleChange} />}
            {onValidChange && (
              <FormSpy
                subscription={{ hasValidationErrors: true }}
                onChange={this.handleValidChange}
              />
            )}
            {children}
          </form>
        )}
      />
    );
  }
}

FinalForm.propTypes = {
  values: PropTypes.object,
  children: PropTypes.node,
  onChange: PropTypes.func,
  onFormChangeProxy: PropTypes.func,
  id: PropTypes.string,
  /** fires on form render if form is initially invalid */
  onValidChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onError: PropTypes.func,
  domNodeRef: CustomPropTypes.ref,
  getValidators: PropTypes.func,
  className: PropTypes.string,
};
