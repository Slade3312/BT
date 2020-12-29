import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';
import { CheckBoxPropsTypes } from './helpers/check-box-props-types';
import CheckBoxOption from './CheckBoxOption';
import CheckBoxGroupContent from './CheckBoxGroupContent';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

class CheckBoxGroup extends React.Component {
  getIsCheckedMainCheckbox = () => {
    const { values } = this.props;
    return !!values.length;
  };
  getIsCheckedOptionCheckbox = (id) => {
    const { values } = this.props;
    return values.includes(id);
  };
  renderMainCheckBox = () => {
    const { onChangeGroup, name, label, tooltip } = this.props;
    return (
      <CheckBoxOption
        tooltip={tooltip}
        className={cx('option')}
        onChange={onChangeGroup}
        value={this.getIsCheckedMainCheckbox()}
        name={name}
        id={name}
        label={label}
        isMain
      />
    );
  };
  renderOptionCheckBox = ({ id, label, tooltip }) => {
    const { onChangeOption, name } = this.props;
    return (
      <CheckBoxOption
        className={cx('option')}
        onChange={onChangeOption}
        key={id}
        value={this.getIsCheckedOptionCheckbox(id)}
        id={`${name}_${id}`}
        name={id}
        label={label}
        tooltip={tooltip}
      />
    );
  };
  render() {
    const { options, values, forwardedRef } = this.props;
    return (
      <CheckBoxGroupContent
        options={options}
        values={values}
        renderParentCheckbox={this.renderMainCheckBox}
        renderOptionCheckbox={this.renderOptionCheckBox}
        ref={forwardedRef}
      />
    );
  }
}

CheckBoxGroup.propTypes = {
  onChangeOption: PropTypes.func,
  onChangeGroup: PropTypes.func,
  values: CheckBoxPropsTypes.value,
  options: CheckBoxPropsTypes.options,
  name: PropTypes.string,
  label: PropTypes.string,
  tooltip: PropTypes.string,
  forwardedRef: CustomPropTypes.ref,
};

export default withForwardedRef(CheckBoxGroup);
