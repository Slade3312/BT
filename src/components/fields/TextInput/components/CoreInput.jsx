import PropTypes from 'prop-types';
import withIcon from '../enhancers/withIcon';
import withCleanup from '../enhancers/withCleanup';
import Input from '../views/Input';

/**
 * Core input used for most of the components it has:
 * - `isClearable` enabled by default,
 * - an icon
 * - `autoTrim` enabled by default
 */
const CoreInput = withIcon(withCleanup(Input));

CoreInput.propTypes = {
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

  /**
   * some notable default input props are listed here
   * all the other props are simply passed down
   */
  size: PropTypes.oneOf(['big', 'default', 'long']),
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
};

export default CoreInput;
