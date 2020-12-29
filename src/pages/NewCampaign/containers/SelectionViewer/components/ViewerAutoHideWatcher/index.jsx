import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSelectionViewerIsOpen } from 'store/NewCampaign/controls/selectors';
import { setSegmentationPopupState } from 'store/NewCampaign/controls/actions';
import { SELECTION_VIEWER_STATES } from 'store/NewCampaign/controls/constants';

const HIDE_DELAY_TIME = 1000;

const ViewerAutoHideWatcher = ({ children, isAutoHide, setPopupState, className }) => {
  let pinnedTimerId = null;

  const hidePopup = () => {
    setPopupState(SELECTION_VIEWER_STATES.CLOSED);
  };

  const handleEnter = () => {
    clearTimeout(pinnedTimerId);
  };

  const handleLeave = () => {
    clearTimeout(pinnedTimerId);
    pinnedTimerId = setTimeout(hidePopup, HIDE_DELAY_TIME);
  };

  const onUnmount = () => clearTimeout(pinnedTimerId);

  useEffect(() => {
    if (isAutoHide) {
      hidePopup();
    }
    return onUnmount;
  }, []);

  return (
    <div
      onMouseLeave={isAutoHide ? handleLeave : undefined} onMouseEnter={isAutoHide ? handleEnter : undefined}
      className={className}
    >
      {children}
    </div>
  );
};

ViewerAutoHideWatcher.propTypes = {
  children: PropTypes.node,
  isAutoHide: PropTypes.bool,
  setPopupState: PropTypes.func,
  className: PropTypes.string,
};

const mapStateToProps = state => ({ isActive: getSelectionViewerIsOpen(state) });

const mapDispatchToProps = {
  setPopupState: setSegmentationPopupState,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewerAutoHideWatcher);
