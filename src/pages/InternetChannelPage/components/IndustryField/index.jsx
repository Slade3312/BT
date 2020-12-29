import React from 'react';
import classNames from 'classnames/bind';

import {
  ORDER_INDUSTRY_FIELD,
} from 'store/NewCampaign/channels/constants';

import FieldLabel from '../FieldLabel';
import { FFInternetIndustry } from '../../containers';
import { useNormalizedInternetFields } from '../../hooks/use-normalized-internet-fields';
import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

const IndustryField = () => {
  const { industry } = useNormalizedInternetFields();
  return (
    <div className={cx('fieldRow')}>
      <FieldLabel
        text={industry.label}
        tooltip={industry.tooltip}
      />

      <FFInternetIndustry
        className={cx('input')}
        keepErrorIndent={false}
      />
    </div>
  );
};
export default IndustryField;
