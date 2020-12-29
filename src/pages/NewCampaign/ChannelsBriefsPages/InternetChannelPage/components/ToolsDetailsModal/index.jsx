import React from 'react';
import PropTypes from 'prop-types';

import { PopupStateless } from 'components/common/Popup/components/Popup';

import ToolsDetailsInfo from './components/ToolsDetailsInfo';

const ToolsDetailsModal = ({ isOpened, setIsPopupOpened }) => (
  <PopupStateless
    opened={isOpened}
    onClose={() => setIsPopupOpened(false)}
  >
    <ToolsDetailsInfo
      onClose={() => setIsPopupOpened(false)}
    />
  </PopupStateless>
);

ToolsDetailsModal.propTypes = {
  isOpened: PropTypes.bool,
  setIsPopupOpened: PropTypes.func,
};

export default ToolsDetailsModal;
