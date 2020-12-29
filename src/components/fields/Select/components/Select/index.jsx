import React from 'react';
import PropTypes from 'prop-types';

import { withToggle } from 'enhancers';
import { withError } from 'components/fields/TextInput/enhancers';

import MetaSelect from '../MetaSelect';
import Options from './components/Options';


class Select extends React.PureComponent {
  getSelectedLabel = () => this.props.options
    .reduce(
      (acc, next) => (next.value === this.props.value ? next.label : acc),
      this.props.placeholder,
    );

  handleChange = (selectValue, e) => {
    const { value, onChange, onClose } = this.props;
    if (value === selectValue) return;
    if (onChange) onChange(selectValue, e);
    onClose();
  };

  render() {
    const {
      name, value, status, placeholder, options, isDisabled, isOpen, onOpen, onClose, className, isCompact, combined,
    } = this.props;

    return (
      <MetaSelect
        displayValue={this.getSelectedLabel()}
        {...{ name, value, status, placeholder, options, isDisabled, isOpen, onOpen, onClose, className, isCompact, combined }}
        onChange={this.handleChange}
        OptionsComponent={Options}
      />
    );
  }
}

Select.defaultProps = {
  value: null,
  placeholder: 'Выберите значение',
  options: [],
};

Select.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  status: PropTypes.string,
  placeholder: PropTypes.string,
  combined: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string,
    description: PropTypes.any,
  })),
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  isCompact: PropTypes.bool,

  /** status and two handlers added by withToggle */
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default withError(withToggle(Select));
