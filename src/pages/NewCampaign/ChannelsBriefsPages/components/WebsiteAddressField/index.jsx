import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ORDER_URL_ADVERTISER_FIELD } from 'store/NewCampaign/channels/constants';
import { FFTextInput } from 'components/fields';
import { FormFieldLabel } from 'components/forms';

import commonStyles from 'styles/common.pcss';
import InfoText from '../InfoText';

const cx = classNames.bind(commonStyles);

export default function WebsiteAddressField({
  className,
  websiteTitle,
  websiteDescription,
  websiteExample,
}) {
  return (
    <div className={className}>
      {websiteTitle && (
        <FormFieldLabel isBold className={cx('marb-xxxs')}>{websiteTitle}</FormFieldLabel>
      )}
      <FFTextInput
        name={ORDER_URL_ADVERTISER_FIELD}
        placeholder={websiteDescription}
        keepErrorIndent={false}
      />
      {websiteExample && <InfoText>{websiteExample}</InfoText>}
    </div>
  );
}

WebsiteAddressField.propTypes = {
  className: PropTypes.string,
  websiteTitle: PropTypes.string,
  websiteDescription: PropTypes.string,
  websiteExample: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};
