import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { getTemplateCampaignSavedDraftNormalized } from 'store/common/templates/notifications/selectors';
import styles from '../styles.pcss';

const cx = classNames.bind(styles);

const CampaignSavedDraft = ({ onClick, info }) => (
  <div className={cx('notificationContainer')} onClick={onClick} key="campaign">
    <h2 className={cx('title')}>{info?.title}</h2>

    <h4 className={cx('description')}>
      {info?.description}
    </h4>
  </div>
);

CampaignSavedDraft.propTypes = {
  onClick: PropTypes.func,
  info: PropTypes.object,
};

export default connect(state => ({
  info: getTemplateCampaignSavedDraftNormalized(state),
}))(CampaignSavedDraft);
