import PropTypes from 'prop-types';

import withError from '../enhancers/withError';
import CoreArea from './CoreArea';

const TextAreaInput = withError(CoreArea);

TextAreaInput.propTypes = {
  /** props added by withError */
  status: PropTypes.oneOf(['fail']),
  error: PropTypes.string,
  keepErrorIndent: PropTypes.bool,

  /** inherited from withIcon */
  Icon: PropTypes.func,
  iconAlt: PropTypes.string,
  isClearable: PropTypes.bool,
  onIconClick: PropTypes.func,
  onClear: PropTypes.func,

  /** inherited from withCleanup */
  autoTrim: PropTypes.bool,
  trimInitialValue: PropTypes.bool,

  /** inherited from View */
  size: PropTypes.oneOf(['big', 'default']),
  className: PropTypes.string,

  /**
   * some notable default input props are listed here
   * all the other props are simply passed down
   */
  value: PropTypes.PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TextAreaInput.defaultProps = {
  value: '',
};
export default TextAreaInput;
