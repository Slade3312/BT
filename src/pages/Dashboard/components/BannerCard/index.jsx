import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import { Banner } from 'components/common';
import PriceBlock from '../PriceBlock';

const BannerCard = ({ id, price, buttonText, buttonColor, backgroundColor, pricePrefix, ...rest }) => {
  const memoizedButtonProps = useMemo(() => ({
    text: buttonText,
    backgroundColor: buttonColor,
  }), [buttonText, buttonColor]);

  return (
    <Banner
      {...rest}
      price={price ? <PriceBlock pricePrefix={pricePrefix} value={price} unit="₽" /> : null}
      button={memoizedButtonProps}
      background={{ color: backgroundColor || 'white' }}
    />
  );
};

BannerCard.propTypes = {
  id: PropTypes.string,
  price: CustomPropTypes.templateField,
  buttonText: CustomPropTypes.templateField,
  buttonColor: PropTypes.string,
  pricePrefix: CustomPropTypes.templateField,
  backgroundColor: PropTypes.string,
};

export default BannerCard;
