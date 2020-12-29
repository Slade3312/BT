import PropTypes from 'prop-types';

const CustomPropTypes = {
  component: PropTypes.oneOfType([PropTypes.func]),
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object }),
  ]),
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  oneOfValues: obj => PropTypes.oneOf(Object.values(obj)),
  templateFormField: PropTypes.shape({
    label: PropTypes.string,
    placeholder: PropTypes.string,
    tooltip: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  }),
  templateField: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default CustomPropTypes;
