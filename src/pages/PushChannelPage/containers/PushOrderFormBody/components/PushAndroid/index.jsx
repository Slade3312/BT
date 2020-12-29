import React, { Fragment } from 'react';

import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';

import { ORDER_URL_ADVERTISER_FIELD } from 'store/NewCampaign/channels/constants';
import { FFTextInput } from 'components/fields';
import { FormFieldLabel } from 'components/forms';
import { InfoText } from 'pages/NewCampaign/ChannelsBriefsPages/components';

const cx = classNames.bind(commonStyles);

const PushAndroid = () => (
  <Fragment>
    <FormFieldLabel isBold className={cx('marb-xxxs')}>
      Ссылка на Google Play
    </FormFieldLabel>
    <FFTextInput
      name={ORDER_URL_ADVERTISER_FIELD}
      placeholder="Введите ссылку на Google Play"
      keepErrorIndent={false}
    />
    <InfoText className={cx('marb-m')}>
      Например, https://play.google.com/store/apps/details?id=co.staply.gap
    </InfoText>
  </Fragment>
);

export default PushAndroid;
