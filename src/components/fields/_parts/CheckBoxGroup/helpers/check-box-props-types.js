import PropTypes from 'prop-types';

const option = {
  id: PropTypes.string,
  label: PropTypes.string,
};

export const CheckBoxPropsTypes = {
  option,
  options: PropTypes.arrayOf(PropTypes.shape(option)),
  value: PropTypes.arrayOf(PropTypes.string),
};
