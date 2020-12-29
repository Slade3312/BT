import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import sharedStyles from '../../shared.pcss';
import styles from './styles.pcss';

const cx = classNames.bind({ ...sharedStyles, ...styles });

export default function CardsKeeper({ children, className }) {
  return (
    <div className={cx('marg-cards', className)}>
      <div className={cx('cardsKeeper')}>
        {React.Children.map(children, (child, key) => (
          <div className={cx('cardWrapper', 'padd-card')} key={+key}>{child}</div>
          ))}
      </div>
    </div>
  );
}

CardsKeeper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
