import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import withForwardedRef from 'enhancers/withForwardedRef';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const TextViewer = ({ value, defaultViewText, className, forwardedRef }) => (
  <div className={cx('component', className)} ref={forwardedRef}>
    {value || defaultViewText}
  </div>
);

TextViewer.defaultProps = {
  defaultViewText: 'нет',
};

TextViewer.propTypes = {
  value: PropTypes.any,
  defaultViewText: PropTypes.string,
  className: PropTypes.string,
  forwardedRef: CustomPropTypes.ref,
};

export default withForwardedRef(TextViewer);
