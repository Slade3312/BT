import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import LinkLegacy from 'components/buttons/LinkLegacy';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const EditLink = ({ children }) => (
  <div className={cx('container')}>
    <LinkLegacy notPseudo className={cx('link')}>
      {children}
    </LinkLegacy>
  </div>
);

EditLink.propTypes = {
  children: PropTypes.node,
};

export default EditLink;
