import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import RadioButton from 'components/fields/_parts/RadioButton';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const WayToMakeCallItem = ({ value, isSelected, onChange, title, description, priceDescription }) => {
  return (
    <div className={cx('container', { selectedContainer: isSelected })}>
      <div className={cx('radioContainer')}>
        <RadioButton
          className={cx('radio')}
          value={value}
          isSelected={isSelected}
          onChange={onChange}
        />
      </div>

      <div className={cx('element')}>
        <h3 className={cx('title')}>{title}</h3>

        <h4 className={cx('description')}>{description}</h4>

        <div className={cx('bottomContainer')}>
          <hr className={cx('line')} />

          <p className={cx('priceBlock')}>
            {priceDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

WayToMakeCallItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  priceDescription: PropTypes.string,
  value: PropTypes.any,
  isSelected: PropTypes.bool,
  onChange: PropTypes.func,
};

export default WayToMakeCallItem;
