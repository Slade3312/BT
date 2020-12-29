import React from 'react';
import classNames from 'classnames/bind';
import { ExoticHeading } from 'components/layouts';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

type Props = {
  className: string,
  title: string,
  description: string
}

function TopContent({ className, title, description } : Props) {
  return (
    <div className={cx('component', className)}>
      <ExoticHeading level={2}>{title}</ExoticHeading>
      <p className={cx('description')}>{description}</p>
    </div>
  );
}

export default TopContent;

