import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { Heading } from 'components/layouts';
import { StoresContext } from 'store/mobx';
import { PlateWrapper } from '../../Plate';
import styles from '../styles.pcss';
import LabeledText from './../../LabeledText';

const cx = classNames.bind(styles);

const PlateHeaderContent = () => {
  const { UserInfo } = useContext(StoresContext);
  return (
    <div className={cx('container')}>
      <PlateWrapper topIndentType={PlateWrapper.propConstants.topIndentTypes.small}>
        <Heading className={cx('title')}>{UserInfo?.data?.company?.name}</Heading>
      </PlateWrapper>

      <PlateWrapper>
        <LabeledText label="Система расчета">
          {UserInfo?.data?.company?.post_pay ? 'Постоплата' : 'Аванс'}
        </LabeledText>
      </PlateWrapper>

      <PlateWrapper>
        <LabeledText label="Номер договора">{UserInfo?.data?.company?.ban}</LabeledText>
      </PlateWrapper>

      <PlateWrapper>
        <LabeledText label="ИНН">{UserInfo?.data?.company?.inn}</LabeledText>
      </PlateWrapper>
    </div>
  );
};

export default observer(PlateHeaderContent);
