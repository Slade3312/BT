import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import classNames from 'classnames/bind';
import { useNormalizedLocation } from 'hooks/use-normalized-location';
import { NEW_CAMPAIGN_URL } from 'pages/constants';
import { pushMainNavClickToGA } from 'utils/ga-analytics/utils';

import { resetCampaign } from 'store/NewCampaign/steps/actions/update';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function MenuEntryItem({ children, url, onClick, isMobile, className, onCompanyReset }) {
  const { pathname, hash } = useNormalizedLocation();

  const isActive = pathname === url || `${pathname}${hash}` === url;

  return (
    <div className={cx('component', { active: isActive, mobile: isMobile }, className)}>
      <Link
        to={url || ''}
        className={cx('link')}
        onClick={(e) => {
          if (!isActive && url === NEW_CAMPAIGN_URL) {
            onCompanyReset();
          }
          pushMainNavClickToGA({ pageTitle: children });
          if (onClick) onClick(e);
        }}
      >
        <span className={cx('linkText')}>{children}</span>
      </Link>
    </div>
  );
}

MenuEntryItem.propTypes = {
  children: PropTypes.node,
  url: PropTypes.string,
  onClick: PropTypes.func,
  onCompanyReset: PropTypes.func,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
};

const mapDispatchToProps = {
  onCompanyReset: resetCampaign,
};

export default connect(
  null,
  mapDispatchToProps,
)(MenuEntryItem);
