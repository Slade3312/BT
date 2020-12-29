import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import Heading from 'components/layouts/Heading';
import UploadAudience from 'pages/AudienceStatistic/components/EditCampaignStepper/components/UploadAudience';
import Background from 'components/common/Banner/components/Background';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles, ...commonStyles });

const LoadBaseBanner = ({
  title,
  description,
  className,
}) => (
  <div id="load-base-banner" className={cx('wrapper', className)}>
    <Background className={cx('background')} />

    <div className={cx('content')}>
      {title && <Heading className={cx('title')}>{title}</Heading>}

      {description && (
        <div className={cx('description')}>{description}</div>
      )}

      <div className={cx('filler')} />
      <UploadAudience />
    </div>
  </div>
);

LoadBaseBanner.propTypes = {
  title: PropTypes.string,
  description: PropTypes.node,
  className: PropTypes.string,
};

export default LoadBaseBanner;
