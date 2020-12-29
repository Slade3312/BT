import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.pcss';


export default class OptionsFactory extends React.Component {
  /**
   * FactoryMethod must return child components used in render
   */
  getChildComponents = () => {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('Must be implemented by overriding components');
    }
  };

  isSelected = (optionValue) => {
    const { value, isMulti } = this.props;
    return isMulti ? value.indexOf(optionValue) !== -1 : value === optionValue;
  };

  render() {
    const { OptionsList, OptionsItem } = this.getChildComponents(this.props);
    const { options, onSelect, isCompact } = this.props;
    return (
      <OptionsList>
        {options.map(item => (
          <OptionsItem
            key={item.value}
            id={`${item.value}_${item.label}`}
            onSelect={e => onSelect(item.value, e)}
            isSelected={this.isSelected(item.value)}
            isCompact={isCompact}
          >
            <div className={styles.labelContent}>
              <span>{item.label}</span>
              <span className={styles.description}>{item.description}</span>
            </div>
          </OptionsItem>
        ))}
      </OptionsList>
    );
  }
}

OptionsFactory.propTypes = {
  value: PropTypes.any,
  isMulti: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string,
    description: PropTypes.any,
  })).isRequired,
  onSelect: PropTypes.func.isRequired,
  isCompact: PropTypes.bool,
};
