import PropTypes from 'prop-types';
import withError from '../enhancers/withError';
import withState from '../enhancers/withState';
import SearchIcon from './assets/search.svg';
import CoreInput from './CoreInput';

/**
 * Raw component is used as a base for multiple other components
 * Cloning is mandatory to prevent defaultProps override for CoreInput component
 */
export const RawSearchInput = { ...CoreInput };

RawSearchInput.defaultProps = {
  Icon: SearchIcon,
  iconAlt: 'Поиск',
  isClearable: true,
};


const SearchInput = withError(RawSearchInput);

SearchInput.propTypes = {
  /** inherited from withIcon */
  Icon: PropTypes.func,
  iconAlt: PropTypes.string,
  isClearable: PropTypes.bool,
  onIconClick: PropTypes.func,
  onClear: PropTypes.func,

  /** inherited from withCleanup */
  autoTrim: PropTypes.bool,
  trimInitialValue: PropTypes.bool,
  onRawChange: PropTypes.func,

  /** inherited from withError */
  status: PropTypes.oneOf(['fail']),
  error: PropTypes.string,
  keepErrorIndent: PropTypes.bool,

  /** inherited from withSuggest */
  items: PropTypes.array,
  itemCaptionExtractor: PropTypes.func,
  filter: PropTypes.func,
  onFetchRequested: PropTypes.func,
  ItemComponent: PropTypes.func,
  showWithEmptyValue: PropTypes.bool,
  showEmptyList: PropTypes.bool,
  EmptyListComponent: PropTypes.func,
  showPending: PropTypes.bool,
  PendingComponent: PropTypes.func,

  /**
   * some notable default input props are listed here
   * all the other props are simply passed down
   */
  size: PropTypes.oneOf(['big', 'default']),
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
};

SearchInput.defaultProps = {
  keepErrorIndent: false,
};

export default SearchInput;


/**
 * stateful version accepts all the same propTypes,
 * except for `value`
 */
export const StatefulSearchInput = withState(SearchInput);
