import React from 'react';
import PropTypes from 'prop-types';

import CustomPropTypes from 'utils/prop-types';
import { isNullOrUndefined } from 'utils/fn';
import { withFinalField } from 'enhancers';
import { MultiTabSelect } from 'components/fields';
import { LightText } from 'components/common';

class FFMultiTabSelect extends React.Component {
  handleValueRemove = (removeVal) => {
    const { onChange, value } = this.props;
    onChange(value.filter(val => removeVal !== val));
  };

  getActiveOptions = () => {
    const { value, options } = this.props;
    return value.map(val => options.find(opt => opt.value === val)).filter(val => !isNullOrUndefined(val));
  };

  hasActiveOptions = () => !!this.getActiveOptions().length;

  render() {
    const { className } = this.props;

    return this.hasActiveOptions() ? (
      <React.Fragment>
        {this.props.label && <LightText>{this.props.label}</LightText>}

        <MultiTabSelect
          blackList={this.props.blackList}
          type="active"
          options={this.getActiveOptions()}
          onRemoveValue={this.handleValueRemove}
          className={className}
          hasOverflow
        />
      </React.Fragment>
    ) : null;
  }
}

FFMultiTabSelect.propTypes = {
  value: PropTypes.array,
  blackList: PropTypes.array,
  options: CustomPropTypes.options,
  onChange: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.string,
};

FFMultiTabSelect.defaultProps = {
  value: [],
};
export default withFinalField(FFMultiTabSelect);
