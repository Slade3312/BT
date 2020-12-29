import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getCampaignEmptySelectionPopup } from 'store/common/templates/newCampaign/selectors';
import { getSelectionCount } from 'store/NewCampaign/controls/selectors';
import { withToggle } from 'enhancers';

import { NotificationPopup } from '../../components';

function EmptySelectionPopup({ onOpen, isOpen, onClose }) {
  const { emojiIcon, description, buttonText, title } = useSelector(getCampaignEmptySelectionPopup);
  const count = useSelector(getSelectionCount);

  useEffect(() => {
    if (count === 0) {
      onOpen();
    }

    if (isOpen && count > 0) {
      onClose();
    }
  }, [count, onOpen]);

  return (
    <NotificationPopup
      isOpen={isOpen}
      onClose={onClose}
      onButtonClick={onClose}
      emoji={emojiIcon}
      description={description}
      buttonText={buttonText}
      title={title}
    />
  );
}

EmptySelectionPopup.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default withToggle(EmptySelectionPopup);
