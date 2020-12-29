import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames/bind';
import GlobalIcon from 'components/common/GlobalIcon';
import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';


const cx = classNames.bind(styles);

const NewRequests = () => {
  const { Tinder } = useContext(StoresContext);
  useEffect(() => {
    Tinder.getMyPartners();
  }, []);
  const countOfRequests = [];
  countOfRequests.length = Tinder.getCurrentBusiness.actions_count;
  countOfRequests.fill(Date.now, 0, Tinder.getCurrentBusiness.actions_count);
  return (
    <div className={cx('container')}>
      <div>
        {
          Tinder.myPartnersLoading &&
          countOfRequests.map(item => {
            return <Loading key={item} />;
          })
        }
        {
          !Tinder.myPartnersLoading && Tinder.getNewRequestsList.map(partner => {
            if (partner.from_business.id === Tinder.activeBusinessId) return null;
            return (
              <div className={cx('item')} key={partner.id} onClick={() => Tinder.goToPartnerView(partner.id)}>
                <span className={cx('from')}>От:</span>
                <div
                  className={cx('icon')}
                  style={{
                    background: `url(${partner.from_business.industry_icon})`,
                    backgroundSize: 'contain',
                  }}
                />
                <span className={cx('company')}>{partner.from_business.name}</span>
                <GlobalIcon slug="iconLeftListBig" className={cx('arrow')}/>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <>
      <div className={cx('item')}>
        <span className={cx('from')}>От:</span>
        <div
          className={cx('icon')}
        />
        <span className={cx('company')}><Skeleton width={140}/></span>
      </div>
    </>
  );
};

export default observer(NewRequests);
