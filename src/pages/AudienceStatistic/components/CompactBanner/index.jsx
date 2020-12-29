import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { navigate } from '@reach/router';
import classNames from 'classnames/bind';
import { resetCampaign } from 'store/NewCampaign/steps/actions/update';
import { NEW_CAMPAIGN_URL } from 'pages/constants';
import { ActionButton } from 'components/buttons';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

function CompactBanner({ title, buttonText, description, className, imageURL, onCampaignReset }) {
  const handleLinkClick = () => {
    onCampaignReset();
    navigate(NEW_CAMPAIGN_URL);
  };

  return (
    <div
      className={cx('container', className)}
      style={{ backgroundImage: `url(${imageURL})` }}
    >
      <h6 className={cx('title')}>{title}</h6>

      <p className={cx('description')}>
        {description}
      </p>

      {buttonText &&
        <ActionButton
          onClick={handleLinkClick}
          iconSlug="arrowRightMinimal"
        >
          {buttonText}
        </ActionButton>
      }
    </div>
  );
}

CompactBanner.propTypes = {
  title: PropTypes.string,
  buttonText: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
  imageURL: PropTypes.string,
  onCampaignReset: PropTypes.func,
};

const mapDispatchToProps = ({
  onCampaignReset: resetCampaign,
});

export default connect(null, mapDispatchToProps)(CompactBanner);
