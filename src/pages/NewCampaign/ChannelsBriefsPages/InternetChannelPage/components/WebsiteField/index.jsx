import React from 'react';
import classNames from 'classnames/bind';
import {
  ORDER_URL_ADVERTISER_FIELD,
  ORDER_MOBILE_VERSION,
} from 'store/NewCampaign/channels/constants';
import { FFTextInput, FFCheckbox } from 'components/fields';

import { useNormalizedInternetFields } from '../../hooks/use-normalized-internet-fields';
import FieldLabel from '../FieldLabel';
import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

const WebsiteField = () => {
  const { urlAdvertiser } = useNormalizedInternetFields();

  return (
    <div className={cx('fieldRow')}>
      <FieldLabel
        className={cx('label')}
        text={urlAdvertiser.label}
      />

      <FFTextInput
        className={cx('input')}
        name={ORDER_URL_ADVERTISER_FIELD}
        placeholder={urlAdvertiser.field}
        keepErrorIndent={false}
      />

      <FFCheckbox
        className={cx('checkbox')}
        name={ORDER_MOBILE_VERSION}
        label="Есть мобильная версия сайта"
        keepErrorIndent={false}
      />
    </div>
  );
};

export default WebsiteField;
