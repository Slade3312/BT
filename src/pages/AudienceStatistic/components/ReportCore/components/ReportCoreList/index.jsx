import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ReportCoreItem from 'pages/AudienceStatistic/components/ReportCore/components/ReportCoreItem';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ReportCoreList({ items, className }) {
  return (
    <div className={cx('list', className)}>
      {items.map(({ title: itemTitle, descriptions }) => (
        <ReportCoreItem
          key={itemTitle}
          className={cx('listCol')}
          title={itemTitle}
          descriptions={descriptions}
        />
      ))}
    </div>
  );
}

ReportCoreList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    descriptions: PropTypes.arrayOf(PropTypes.string),
  })),
};
