import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'rc-slider/assets/index.css';
import SliderRC from 'rc-slider/es/Slider';

import './styles.global.pcss';

export default function Slider({ className, ...props }) {
  return <SliderRC className={classNames('custom-base', className)} {...props} />;
}

Slider.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
