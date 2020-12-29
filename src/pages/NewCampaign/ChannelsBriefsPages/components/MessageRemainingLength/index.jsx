import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import InfoText from '../InfoText';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function MessageRemainingLength({ currentLength, limit, className }) {
  return (
    <InfoText className={className}>
      Не более {limit} знаков
      {currentLength > 0 && (
        <span className={cx({ error: currentLength > limit })}> (осталось {limit - currentLength})</span>
      )}
    </InfoText>
  );
}

MessageRemainingLength.propTypes = {
  currentLength: PropTypes.number,
  limit: PropTypes.number,
  className: PropTypes.string,
};
