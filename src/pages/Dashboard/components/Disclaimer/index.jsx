import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function Disclaimer({ className, children }) {
  return (
    <div className={cx('component', className)}>
      {children}
    </div>
  );
}

Disclaimer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default observer(Disclaimer);
