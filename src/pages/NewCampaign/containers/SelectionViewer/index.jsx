import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';

import SegmentationCompactManager from './components/SegmentationCompactManager';
import Part from './components/Part';
import Audience from './components/Audience';
import ViewerAutoHideWatcher from './components/ViewerAutoHideWatcher';
import ViewerActivateWrapper from './components/ViewerActivateWrapper';
import Loader from './components/Loader';

import styles from './styles.pcss';

const SelectionViewer = ({ className, isOpeningForbidden }) => {
  const { NewCampaign } = useContext(StoresContext);
  const [isOpen, setIsOpen] = useState(false);

  const handlePopupOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  return (
    <ViewerAutoHideWatcher
      className={classNames(styles.container, isOpeningForbidden && styles.isNotClickable, className)}
    >
      <Loader isLoading={NewCampaign.isSelectionLoading}>
        <ViewerActivateWrapper isDisable={isOpeningForbidden} onPopupOpen={handlePopupOpen}>
          <Part>
            <Audience isOpeningForbidden={isOpeningForbidden} isActive={isOpen} />
          </Part>
        </ViewerActivateWrapper>

        <Part isLast isOpen={isOpen}>
          <SegmentationCompactManager />
        </Part>
      </Loader>
    </ViewerAutoHideWatcher>
  );
};

SelectionViewer.propTypes = {
  className: PropTypes.string,
  isOpeningForbidden: PropTypes.bool,
};

export default observer(SelectionViewer);
