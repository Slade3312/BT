import React from 'react';
import PropTypes from 'prop-types';

import Options from './components/Options';


export default class CheckboxList extends React.PureComponent {
  handleChange = (selectValue) => {
    const { onChange, value, options } = this.props;

    if (onChange) {
      const newValue = options
        .filter(opt => (opt.value === selectValue) !== (value.indexOf(opt.value) !== -1))
        .map(opt => opt.value);

      onChange(newValue);
    }
  };

  render() {
    const { value, options, className } = this.props;
    return (
      <div className={className}>
        <Options options={options} value={value} onSelect={this.handleChange} />
      </div>
    );
  }
}

CheckboxList.defaultProps = {
  value: [],
  options: [],
};

CheckboxList.propTypes = {
  value: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string,
  })),
  onChange: PropTypes.func,
  className: PropTypes.string,
};
