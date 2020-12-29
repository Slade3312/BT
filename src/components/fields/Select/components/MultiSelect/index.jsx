import React from 'react';
import PropTypes from 'prop-types';

import { withToggle, withDefaultValue } from 'enhancers';
import { withError } from 'components/fields/TextInput/enhancers';

import MetaSelect from '../MetaSelect';
import MultiOptions from './components/MultiOptions';


class MultiSelect extends React.PureComponent {
  getDisplayValue = () => {
    const { options, value, placeholder } = this.props;
    const firstSelectedOption = options.find(opt => value.indexOf(opt.value) !== -1);

    if (firstSelectedOption) {
      const extraCount = value.length - 1;
      return firstSelectedOption.label + (extraCount ? ` + ${extraCount}` : '');
    }
    return placeholder;
  };

  handleChange = (selectValue, e) => {
    const { onChange, value, options } = this.props;

    if (onChange) {
      const newValue = options
        .filter(opt => (opt.value === selectValue) !== (value.indexOf(opt.value) !== -1))
        .map(opt => opt.value);

      onChange(newValue, e);
    }
  };

  render() {
    const {
      name, value, status, placeholder, options, isDisabled, isOpen, onOpen, onClose, className,
    } = this.props;

    return (
      <MetaSelect
        displayValue={this.getDisplayValue()}
        {...{ name, value, status, placeholder, options, isDisabled, isOpen, onOpen, onClose, className }}
        onChange={this.handleChange}
        OptionsComponent={MultiOptions}
      />
    );
  }
}

MultiSelect.defaultProps = {
  value: [],
  options: [],
  placeholder: 'Не важно',
};

MultiSelect.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  status: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string,
    description: PropTypes.any,
  })),
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,

  /** status and two handlers added by withToggle */
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default withError(withToggle(withDefaultValue(MultiSelect)));
