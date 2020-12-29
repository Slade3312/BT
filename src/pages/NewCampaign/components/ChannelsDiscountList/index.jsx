import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getChannelsWidgetsCardsItemsByIds } from 'store/common/templates/newCampaign/selectors';
import { Heading } from 'components/layouts';
import { formatPriceWithLabel } from 'utils/formatting';
import StrikeThroughText from 'components/common/StrikeThroughText';
import styles from './styles.pcss';

export default function ChannelsPriceList({
  pricesList,
  className,
}) {
  const channelWidgetsInfo = useSelector(getChannelsWidgetsCardsItemsByIds);

  return (
    <div className={classNames(styles.component, className)}>
      <Heading className={styles.discountsTitle} level={4}>
        Итог по выбранным каналам:
      </Heading>
      {pricesList.map(({ channelType, discountPrice, price }) => {
        const isDiscountPrice = typeof discountPrice === 'number' && discountPrice !== price;
          return (
            <div key={channelWidgetsInfo[channelType]?.title} className={styles.item}>
              <span className={styles.title}>
                {channelWidgetsInfo[channelType]?.title}
              </span>
              {isDiscountPrice && (
                <>
                  <span className={styles.previousPrice}>
                    <StrikeThroughText>
                      {formatPriceWithLabel(price)}
                    </StrikeThroughText>
                  </span>
                  <span className={styles.discountPrice}>
                    {formatPriceWithLabel(discountPrice)}
                  </span>
                </>
              ) ||
              <span className={styles.discountPrice}>
                {formatPriceWithLabel(price)}
              </span>
              }
            </div>
          );
      })}
    </div>
  );
}

ChannelsPriceList.propTypes = {
  pricesList: PropTypes.array,
  className: PropTypes.string,
};
