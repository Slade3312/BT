import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import withCollapser from '../../enhancers/withCollapser';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function FrameContent({ children }) {
  return (
    <div className={cx('content')}>{children}</div>
  );
}

FrameContent.propTypes = {
  children: PropTypes.node,
};

export default withCollapser(FrameContent);
