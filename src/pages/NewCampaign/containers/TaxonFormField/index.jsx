import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormField } from 'components/forms';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


function TaxonFormField({ children, label, tooltip, isWide, description, ...otherProps }) {
  return (
    <FormField
      label={label}
      tooltip={label !== tooltip && tooltip}
      description = {description}
      {...otherProps}
    >
      <div className={cx('content', { headlessField: !label }, { wide: isWide })}>
        {children}
      </div>
    </FormField>
  );
}

TaxonFormField.propTypes = {
  ...FormField.propTypes,
  children: PropTypes.node,
  className: PropTypes.string,
  isWide: PropTypes.bool,
};

export default TaxonFormField;
