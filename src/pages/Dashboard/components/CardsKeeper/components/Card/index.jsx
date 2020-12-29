import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from '@reach/router';
import { pushBannerClickCardToGA } from 'utils/ga-analytics/utils';
import { GlobalIcon } from 'components/common';

import Price from '../../../PriceBlock';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function Card({ iconUrl, title, description, price, pricePrefix, href, className }) {
  return (
    <Link
      to={href || ''}
      className={cx('container', { link: href }, className)}
      onClick={() => pushBannerClickCardToGA({ title })}
    >
      {iconUrl && <img src={iconUrl} alt="" className={cx('icon')} />}

      {title && (
        <div className={cx('titleContainer')}>
          <span className={cx('title')}>{title}</span>
          {href && <GlobalIcon slug="dropdownArrow" className={cx('arrow')} />}
        </div>
      )}
      {description && (
        <div className={cx('description')}>{description}</div>
      )}

      <div className={cx('filler')} />

      {price && (
        <div className={cx('bottom')}>
          <Price pricePrefix={pricePrefix} value={price} unit="₽" />
        </div>
      )}
    </Link>
  );
}

Card.propTypes = {
  iconUrl: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  pricePrefix: PropTypes.string,
  href: PropTypes.string,
  className: PropTypes.string,
};
