import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Heading } from 'components/layouts';
import ArrowIcon from '../../assets/arrowRight.svg';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function TitleCard({ title, onClick, className }) {
  return (
    <div className={cx('container', className)} onClick={onClick}>
      {title && <Heading level={4} className={cx('title')}>{title}</Heading>}
      <div className={cx('arrow')}><ArrowIcon /></div>
    </div>
  );
}

TitleCard.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

TitleCard.defaultProps = {
  onClick: () => {},
};
