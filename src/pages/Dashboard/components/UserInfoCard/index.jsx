import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import { StoresContext } from 'store/mobx';
import { USER_INFO_URL } from 'pages/constants';
import { IconLink } from 'components/buttons';
import { CurrentDate, LabeledText } from './components';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function UserInfoCard({ className }) {
  const { UserInfo } = useContext(StoresContext);
  const industry = UserInfo.selectedIndustryLabel;
  const company = UserInfo?.data?.company;

  const onLinkClick = (e) => {
    e.preventDefault();
    UserInfo.set('isEditable', true);
    navigate(USER_INFO_URL);
  };

  return (
    <div className={cx('container', className)}>
      <CurrentDate className={cx('date')} />

      <div className={cx('userInfo')}>
        <LabeledText label="Название компании" className={cx('row')}>
          {company?.name}
        </LabeledText>

        <LabeledText label="Система расчёта" className={cx('row')}>
          {company?.post_pay ? 'Постоплата' : 'Аванс'}
        </LabeledText>

        <LabeledText label="Номер договора" className={cx('row')}>
          {company?.ban}
        </LabeledText>

        <LabeledText label="Отрасль" className={cx('row')}>
          {industry}
        </LabeledText>
      </div>

      <IconLink onClick={onLinkClick} slug="edit">
        {industry ? 'Редактировать' : 'Заполнить'}
      </IconLink>
    </div>
  );
}

UserInfoCard.propTypes = {
  className: PropTypes.string,
};

export default observer(UserInfoCard);
