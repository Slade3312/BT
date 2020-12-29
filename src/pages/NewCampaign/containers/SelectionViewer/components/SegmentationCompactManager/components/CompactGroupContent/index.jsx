import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation, Link } from '@reach/router';
import classNames from 'classnames/bind';
import { NEW_CAMPAIGN_URL } from 'pages/constants';
import { normalizeEndOfUrl } from 'utils/router';

import Tabs from '../Tabs';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const CompactGroupContent = ({ items, slug, onTabRemove, title, subTitle, isWithoutRemove }) => {
  const params = useParams();
  const location = useLocation();

  return (
    <div key={title} className={cx('group', 'row')}>
      {title && <div className={cx('title')}>{title}</div>}

      <div className={cx('wrapper')}>
        <div className={cx('cell')}>
          <div className={cx('subTitleWrapper')}>
            <div className={cx('subTitle')}>{subTitle}</div>

            <Link
              className={cx('link', {
                disabled: slug === 'geo'
                  ? normalizeEndOfUrl(location.pathname) === `${NEW_CAMPAIGN_URL}${params.campaignId}/audience/`
                  : location.pathname === `${NEW_CAMPAIGN_URL}${params.campaignId}/audience/${slug}`,
              })}
              to={slug === 'geo'
                ? `${NEW_CAMPAIGN_URL}${params.campaignId}/audience/`
                : `${NEW_CAMPAIGN_URL}${params.campaignId}/audience/${slug}`
              }
            >
              Изменить
            </Link>
          </div>
        </div>

        <div className={cx('cell')}>
          <Tabs items={items} onRemoveValue={onTabRemove} isWithoutRemove={isWithoutRemove} />
        </div>
      </div>
    </div>
  );
};

CompactGroupContent.propTypes = {
  items: PropTypes.array,
  slug: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  onTabRemove: PropTypes.func,
  isWithoutRemove: PropTypes.bool,
};

export default CompactGroupContent;
