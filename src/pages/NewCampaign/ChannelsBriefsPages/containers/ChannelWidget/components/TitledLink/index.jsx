import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.pcss';

const TitledLink = ({ children, isDisabled }) => (
  <div className={classNames(styles.component, isDisabled && styles.disabled)}>
    {/* additional span to save multiline underlines */}
    <span>
      <span className={styles.link}>{children}</span>
    </span>
  </div>
);

TitledLink.propTypes = {
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
};

export default TitledLink;
