import React from 'react';
import PropTypes from 'prop-types';

import { wordFormByCount } from 'utils/fn';
import { withFinalField } from 'enhancers';
import { StatefulSuggestTextInput } from 'components/fields/TextInput';

import ItemComponent from './ItemComponent';
import ErrorItemComponent from './ErrorItemComponent';
import ItemInfoLabel from './ItemInfoLabel';

class MultiRegionSuggestTextInput extends React.PureComponent {
  state = {
    filterText: '',
  };

  handleChangeFilter = (val) => {
    this.setState({ filterText: val });
  };

  ErrorItemComponent = props => <ErrorItemComponent {...props} value="Регион не найден" />;

  ItemComponentWithBold = (props) => {
    const { filterText } = this.state;
    return <ItemComponent {...props} filterText={filterText} />;
  };

  DropDownBottomComponent = ({ items }) => {
    const { maxItemsView } = this.props;
    const resultsText = `${maxItemsView} ${wordFormByCount(maxItemsView, ['результат', 'результата', 'результатов'])}`;
    return items.length >= maxItemsView && <ItemInfoLabel>Показаны первые {resultsText}</ItemInfoLabel>;
  };

  getAvailableOptions = () => {
    const { options, value } = this.props;
    return options.filter(item => value.indexOf(item.value) === -1);
  };

  render() {
    const { value, options, onChange, maxItemsView, ...inheritedProps } = this.props;

    return (
      <StatefulSuggestTextInput
        {...inheritedProps}
        DropDownBottomComponent={this.DropDownBottomComponent}
        items={this.getAvailableOptions()}
        value=""
        onChange={this.handleChangeFilter}
        maxItemsView={maxItemsView}
        ItemComponent={this.ItemComponentWithBold}
        onConfirmChange={onChange ? newItem => onChange([...value, newItem]) : undefined}
        itemCaptionExtractor={item => item.label.toString()}
        placeholder="Укажите регион"
        UNSAFE_selectMode
        EmptyListComponent={this.ErrorItemComponent}
        showEmptyList
      />
    );
  }
}

MultiRegionSuggestTextInput.propTypes = {
  value: PropTypes.array,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  onChange: PropTypes.func,
  maxItemsView: PropTypes.number,
};

MultiRegionSuggestTextInput.defaultProps = {
  value: [],
  maxItemsView: 100,
};

export default withFinalField(MultiRegionSuggestTextInput);
