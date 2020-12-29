import withError from '../enhancers/withError';
import withSuggestions from '../enhancers/withSuggestions';
import withState from '../enhancers/withState';
import CoreInput from './CoreInput';

/**
 * Input with mask set up to handle Phone
 */
const SuggestTextInput = withError(withSuggestions(CoreInput));
export default SuggestTextInput;


/**
 * stateful version accepts all the same propTypes,
 * except for `value`
 */
export const StatefulSuggestTextInput = withState(SuggestTextInput);
