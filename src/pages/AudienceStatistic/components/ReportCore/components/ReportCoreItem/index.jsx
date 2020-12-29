import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

export default function ReportCoreItem({ title, descriptions, className }) {
  return (
    <div className={cx('component', className)}>
      <div className={cx('title')}>{title}</div>
      <div className={cx('descriptions')}>
        {descriptions?.map(description => (
          <span className={cx('tag')} key={description}>{description}</span>
        ))}
      </div>
    </div>
  );
}

ReportCoreItem.propTypes = {
  title: PropTypes.string,
  descriptions: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};
