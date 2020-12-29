import PropTypes from 'prop-types';

import withSuggestions from '../enhancers/withSuggestions';
import withError from '../enhancers/withError';
import withState from '../enhancers/withState';
import { RawSearchInput } from './SearchInput';


/**
 * SearchInput extended for suggest
 */
const SuggestSearchInput = withError(withSuggestions(RawSearchInput));

SuggestSearchInput.propTypes = {
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

SuggestSearchInput.defaultProps = {
  keepErrorIndent: false,
};

export default SuggestSearchInput;


/**
 * stateful version accepts all the same propTypes,
 * except for `value` that changes role to 'initial value'
 */
export const StatefulSuggestSearchInput = withState(SuggestSearchInput);
