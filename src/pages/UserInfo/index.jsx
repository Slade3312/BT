import React, { useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import PageLayout from 'pages/_PageLayout';
import commonStyles from 'styles/common.pcss';
import { StoresContext } from 'store/mobx';
import { PageLoader } from 'components/common/Loaders/components';
import styles from './UserInfo.pcss';
import { PlateHeaderContent, Plate, PlateContactsData, RowFlex, UserInfoForm } from './components';

const cxCommon = classNames.bind(commonStyles);
const cx = classNames.bind(styles);

const UserInfoPage = () => {
  const { UserInfo, Templates, Common } = useContext(StoresContext);
  useEffect(() => {
    const request = async () => {
      try {
        await Promise.all([
          Common.getConstants(),
          Common.getIndustries(),
          Templates.getTemplate('userInfo'),
        ]);
      } finally {
        UserInfo.set('isLoading', false);
      }
    };

    request();
  }, []);
  return (
    <PageLoader isLoading={UserInfo.isLoading}>
      <PageLayout>
        <UserInfoForm>
          <RowFlex className={cx('row')}>
            <Plate className={cx('plate', 'logoHeader')}>
              <PlateHeaderContent />
            </Plate>
          </RowFlex>
          <RowFlex className={cxCommon('mart-xxs')}>
            <Plate className={cx('plate', 'contactData')}>
              <PlateContactsData />
            </Plate>
          </RowFlex>
        </UserInfoForm>
      </PageLayout>
    </PageLoader>
  );
};

export default observer(UserInfoPage);
