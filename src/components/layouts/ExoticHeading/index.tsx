/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames/bind';

import Heading from 'components/layouts/Heading';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

type Props = {
  className?: string,
  level?: 1 | 2 | 3 | 4 | 5 | 6,
}

const ExoticHeading : React.FC<Props> = ({ className, ...otherProps }) => {
  const { level } = otherProps;
  return (
    <Heading
      {...otherProps}
      className={cx('component', { [`h${level}`]: level }, className)}
    />
  );
};

// ExoticHeading.defaultProps = Heading.defaultProps;

export default ExoticHeading;
