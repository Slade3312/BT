import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Heading } from 'components/layouts';
import commonStyles from 'styles/common.pcss';
import IconChooser from '../../IconChooser';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

export default function ErrorBase({ title, children, level, iconType }) {
  return (
    <div className={cx('component')}>
      <IconChooser className={cx('marb-l')} type={iconType || IconChooser.propConstants.types.fail} />
      <Heading level={level} className={cx('marb-m', 'title')}>
        {title}
      </Heading>
      {children}
    </div>
  );
}

ErrorBase.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  level: PropTypes.number,
  iconType: PropTypes.string,
};
