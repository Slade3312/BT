import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import StrikeThroughText from 'components/common/StrikeThroughText';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function Line({
  title,
  description,
  className,
  discountPrice,
  isBigTitle,
}) {
  return (
    <div className={cx('component', className)}>
      <div className={cx('titleRow', { big: isBigTitle })}>
        <span>{title}</span>
        <span>
          {discountPrice && (
            <StrikeThroughText className={styles.previousPrice}>
              {description}
            </StrikeThroughText>
          )}
        </span>
      </div>

      <span>{discountPrice || description}</span>
    </div>
  );
}

Line.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  discountPrice: PropTypes.string,
  className: PropTypes.string,
  isBigTitle: PropTypes.bool,
};
