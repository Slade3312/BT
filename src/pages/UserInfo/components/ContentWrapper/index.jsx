import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { Wrapper } from 'components/layouts';
import { isScreenBelow800 } from 'store/common/breakpoint/selectors';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const ContentWrapper = ({ children, isMobile, className }) => (
  <Wrapper className={cx({ mobile: isMobile }, className)}>
    {children}
  </Wrapper>
);

ContentWrapper.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
};

export default connect(state => ({
  isMobile: isScreenBelow800(state),
}))(ContentWrapper);

