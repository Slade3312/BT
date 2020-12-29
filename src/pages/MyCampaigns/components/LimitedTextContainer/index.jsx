import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

export default function LimitedTextContainer({ children, hasNoGradient, className, draft }) {
  return <span className={cx(draft ? 'draftComponent' : 'component', { hasNoGradient }, className)}>{children}</span>;
}

LimitedTextContainer.propTypes = {
  children: PropTypes.node,
  hasNoGradient: PropTypes.bool,
  className: PropTypes.string,
  draft: PropTypes.string,
};
