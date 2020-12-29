import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import RadioButton from 'components/fields/_parts/RadioButton';
import { formatFloatWithComma } from 'utils/formatting';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const ConnectionTypeItem = ({
  value,
  isSelected,
  onChange,
  title,
  description,
  isFrom,
  price,
  priceDescription,
  NDSLabel,
}) => {
  return (
    <div className={cx('container', { selectedContainer: isSelected })}>
      <div className={styles.radioContainer}>
        <RadioButton
          className={styles.radio}
          value={value}
          isSelected={isSelected}
          onChange={onChange}
        />
      </div>

      <div className={styles.element}>
        <h3 className={styles.title}>{title}</h3>

        <h4 className={styles.description}>{description}</h4>

        <div className={styles.bottomContainer}>
          <hr className={styles.line} />

          <p className={styles.priceBlock}>
            {isFrom && 'от '}
            {formatFloatWithComma(`${price}`.replace(/(\d)(?=(\d{3})+$)/g, '$1 '))}
            {' ₽ '}
            <span className={styles.priceDescription}>{priceDescription}</span>
          </p>

          <p className={styles.nds}>{NDSLabel}</p>
        </div>
      </div>
    </div>
  );
};

ConnectionTypeItem.propTypes = {
  NDSLabel: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  isFrom: PropTypes.bool,
  price: PropTypes.number,
  priceDescription: PropTypes.string,
  value: PropTypes.any,
  isSelected: PropTypes.bool,
  onChange: PropTypes.func,
};

export default ConnectionTypeItem;
