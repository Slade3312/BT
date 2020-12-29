import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Tooltip } from 'components/common';
import PureButton from 'components/buttons/PureButton';
import withErase from '../../enhancers/withErase';

import FrameContent from '../FrameContent';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function ChartWrapper({ title, tooltip, isFrameExpanded, onErase, onExpand, hasCollapse, hasErase, children }) {
  return (
    <div className={cx('container')}>
      <div className={cx('headerLimiter')}>
        <div className={cx('header')}>
          <div className={cx('title')}>{title}</div>

          <div className={cx('tools')}>
            {tooltip && <Tooltip>{tooltip}</Tooltip>}
            {hasCollapse && <PureButton className={cx('hideButton', { open: isFrameExpanded })} onClick={onExpand} />}
            {hasErase && <PureButton className={cx('exitButton')} onClick={onErase} />}
          </div>
        </div>
      </div>
      <div className={cx('content')}>
        <FrameContent isFrameExpanded={isFrameExpanded} onExpand={onExpand}>
          {children}
        </FrameContent>
      </div>
    </div>
  );
}

ChartWrapper.propTypes = {
  title: PropTypes.string,
  isFrameExpanded: PropTypes.bool,
  tooltip: PropTypes.string,
  children: PropTypes.node,
  onExpand: PropTypes.func,
  onErase: PropTypes.func,
  hasCollapse: PropTypes.bool,
  hasErase: PropTypes.bool,
};

export default withErase(ChartWrapper);
