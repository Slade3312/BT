import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { FollowContainer } from 'components/helpers';
import { getSelectionCount } from 'store/NewCampaign/controls/selectors';
import SelectionViewer from '../SelectionViewer';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const SegmentationWrapper = ({
  children,
  isOpeningForbidden,
  isSticky,
  className,
}) => {
  const followRef = useRef(null);
  const [followNode, setFollowNode] = useState(null);

  useEffect(() => {
    setFollowNode(followRef.current);
  }, []);

  const renderViewer = useCallback(() => (isSticky ? (
    <FollowContainer containerNode={followNode} watchResize>
      <SelectionViewer
        isOpeningForbidden={isOpeningForbidden}
        className={cx('viewer', className)}
      />
    </FollowContainer>
  ) : (
    <SelectionViewer
      isOpeningForbidden={isOpeningForbidden}
      className={cx('viewer')}
    />
  )), [followNode, isSticky]);

  return (
    <div className={cx('container')}>
      <div className={cx('content-col')}>{children}</div>

      <div ref={followRef} className={cx('viewer-col')}>
        {renderViewer()}
      </div>
    </div>
  );
};

SegmentationWrapper.propTypes = {
  children: PropTypes.node,
  isSticky: PropTypes.bool,
  className: PropTypes.string,
  isOpeningForbidden: PropTypes.bool,
};

SegmentationWrapper.defaultProps = {
  isSticky: true,
};

export default connect(state => ({ segmentationCount: getSelectionCount(state) }))(SegmentationWrapper);
