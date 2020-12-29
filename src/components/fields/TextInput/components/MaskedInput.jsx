import PropTypes from 'prop-types';
import withMask from '../enhancers/withMask';

import withError from '../enhancers/withError';
import withIcon from '../enhancers/withIcon';
import Input from '../views/Input';

const MaskedInput = withError(withIcon(withMask(Input)));
export const MaskedInputWithoutError = withIcon(withMask(Input));

MaskedInput.propTypes = {
  /** inherited from withError */
  status: PropTypes.oneOf(['fail']),
  error: PropTypes.string,
  keepErrorIndent: PropTypes.bool,

  /** inherited from withIcon */
  Icon: PropTypes.func,
  iconAlt: PropTypes.string,
  isClearable: PropTypes.bool,
  onIconClick: PropTypes.func,
  onClear: PropTypes.func,

  /** inherited from withMask */
  mask: PropTypes.string.isRequired,
  unmaskValue: PropTypes.func.isRequired,

  /**
   * some notable default input props are listed here
   * all the other props are simply passed down
   */
  size: PropTypes.oneOf(['big', 'default']),
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
};

export default MaskedInput;
