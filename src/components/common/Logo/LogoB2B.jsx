import React from 'react';
import PropTypes from 'prop-types';

const LogoB2B = ({ isMobile, className }) => (
  <img
    className={className}
    src="//static.beeline.ru/upload/images/marketing/BEEprodvijenie.svg"
    height={isMobile ? 30 : 40}
    alt="ПРОдвижение"
  />
);

LogoB2B.propTypes = {
  isMobile: PropTypes.bool,
  className: PropTypes.any,
};


export default LogoB2B;
