import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import { escapeStringRegexp } from 'utils/fn';
import { formatPriceWithLabel } from 'utils/formatting';
import { getActivityFields } from 'store/MyCampaigns/selectors';
import SearchIcon from 'components/fields/TextInput/components/assets/search.svg';
import CrossIcon from 'components/fields/TextInput/components/assets/cross.svg';
import DownArrowIcon from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/assets/icons/DownArrow.svg';
import UpArrowIcon from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/assets/icons/UpArrow.svg';

import styles from './styles.pcss';

const ref = React.createRef();

class Suggester extends React.Component {
  constructor() {
    super();

    this.state = {
      suggestions: [],
      isOpened: false,
    };
  }

  escapeRegexCharacters(str) {
    return escapeStringRegexp(str);
  }

  getSuggestions(value) {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return this.props.tariffs;
    }

    const regex = new RegExp(`^${escapedValue}`, 'i');

    return this.props.tariffs
      .map(section => {
        return {
          group_name: section.group_name,
          children: section.children.filter(language => regex.test(language.name)),
        };
      })
      .filter(section => section.children.length > 0);
  }

  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  renderSuggestion(suggestion) {
    return (
      <p className={styles.suggestion}>
        <span>{suggestion.name}</span>
        <span>{formatPriceWithLabel(suggestion.cost)}</span>
      </p>
    );
  }

  renderSectionTitle(section) {
    return (
      <strong>{section.group_name}</strong>
    );
  }

  getSectionSuggestions(section) {
    return section.children;
  }

  shouldRenderSuggestions() {
    return true;
  }

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.onChange({
      name: suggestion.name,
      cost: suggestion.cost,
      id: suggestion.id,
    });
    this.setState({
      isOpened: false,
    });
  };

  onChange = (event, { newValue }) => {
    this.props.onChange({
      name: newValue,
      cost: null,
      id: null,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
      isOpened: true,
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  clearField = () => {
    this.props.onChange({
      name: null,
      cost: null,
      id: null,
    });

    // Ohh, guys, it's because click at cross calls an onBlur on input and we miss the focus :(
    setTimeout(() => {
      ref.current?.input?.focus?.();
    });
  };

  onFocus = () => {
    this.setState({
      isOpened: true,
    });
  };

  onBlur = () => {
    this.setState({
      isOpened: false,
    });
  };

  renderInputComponent = (inputProps) => {
    return (
      <label>
        <SearchIcon className={styles.searchIcon} />

        <input {...inputProps} spellCheck="false" />

        {this.state.isOpened && this.props.value.name && (
          <CrossIcon
            className={styles.cross}
            onMouseDown={this.clearField}
          />
        )}

        {this.state.isOpened && !this.props.value.name && (
          <UpArrowIcon
            className={styles.arrow}
            onMouseDown={this.onBlur}
          />
        )}

        {!this.state.isOpened && (
          <DownArrowIcon className={styles.arrow} />
        )}
      </label>
    );
  };

  render() {
    const { suggestions } = this.state;

    // it is for drafts, get exact tariff from list of tariffs
    if (!this.props.value.name && this.props.value.id) {
      for (let i = 0; i < this.props.tariffs.length; i += 1) {
        const elem = this.props.tariffs[i].children.find((child) => {
          return child.id === this.props.value.id;
        });

        if (elem) {
          this.props.onChange({
            name: elem.name,
            cost: elem.cost,
            id: elem.id,
          });
          break;
        }
      }
    }

    const inputProps = {
      placeholder: 'Отрасль, тип товара или услуги',
      value: this.props.value.name || '',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
    };

    return (
      <Autosuggest
        ref={ref}
        multiSection
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        renderInputComponent={this.renderInputComponent}
        renderSectionTitle={this.renderSectionTitle}
        getSectionSuggestions={this.getSectionSuggestions}
        inputProps={inputProps}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
      />
    );
  }
}

Suggester.propTypes = {
  tariffs: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    cost: PropTypes.number,
  }),
};

const mapStateToProps = state => ({
  tariffs: getActivityFields(state),
});

export default connect(mapStateToProps)(Suggester);
