import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import { BackLink } from 'components/buttons';
import { AUDIENCE_STATISTIC_URL } from 'pages/constants';
import { REPORTS_LIST_ID } from 'pages/AudienceStatistic/constants';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ReportCoreHead({ title, className, hasBackLink }) {
  const handleNavigate = async () => {
    navigate(`${AUDIENCE_STATISTIC_URL}#${REPORTS_LIST_ID}`);
  };
  return (
    <Fragment>
      {hasBackLink && <BackLink onClick={handleNavigate} className={cx('backLink')} />}
      <div className={cx('title', className)}>{title}</div>
    </Fragment>
  );
}

ReportCoreHead.propTypes = {
  title: PropTypes.string,
  hasBackLink: PropTypes.bool,
  className: PropTypes.string,
};
