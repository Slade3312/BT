import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { MY_BUSINESS_TABS } from 'store/mobx/Tinder';
import GlobalIcon from 'components/common/GlobalIcon';
import { StoresContext } from 'store/mobx';
import ActiveActions from './containers/ActiveActions';
import ActivePartners from './containers/ActivePartners';
import NewRequests from './containers/NewRequests';
import styles from './styles.pcss';


const cx = classNames.bind(styles);

const BusinessControls = () => {
  const { Tinder } = useContext(StoresContext);
  useEffect(() => {
    Tinder.set('myBusinessActiveTab', MY_BUSINESS_TABS.ACTIVE_ACTIONS);
  }, []);
  return (
    <div className={styles.container}>
      <div
        className={styles.backContainer}
        onClick={() => Tinder.goBackToBusinessList()}
      >
        <GlobalIcon slug="backSmallArrow" className={styles.backIcon}/>
        <span className={styles.backText}>Назад</span>
      </div>
      <div className={styles.infoContainer}>
        <div
          className={styles.listIcon}
          style={{
            background: `url(${Tinder.getCurrentBusiness.industry_icon})`,
            backgroundSize: 'contain',
          }}
        />
        <div className={styles.itemName}>{Tinder.getCurrentBusiness.name}</div>
      </div>
      <div className={styles.address}>{Tinder.getCurrentBusiness.address}</div>

      <Controls />
      {
          Tinder.myBusinessActiveTab === MY_BUSINESS_TABS.ACTIVE_ACTIONS &&
          <ActiveActions />
      }

      {
          Tinder.myBusinessActiveTab === MY_BUSINESS_TABS.ACTIVE_PARTNERSHIPS &&
          <ActivePartners />
      }

      {
          Tinder.myBusinessActiveTab === MY_BUSINESS_TABS.NEW_REQUESTS &&
          <NewRequests />
      }

    </div>
  );
};

const Controls = observer(() => {
  const { Tinder } = useContext(StoresContext);
  return (
    <div className={styles.sidebar}>
      <div className={styles.navPanel}>
        <div
          className={cx('navItem', { active: Tinder.myBusinessActiveTab === MY_BUSINESS_TABS.ACTIVE_ACTIONS })}
          onClick={() => Tinder.set('myBusinessActiveTab', MY_BUSINESS_TABS.ACTIVE_ACTIONS)}
        >
          Активные<br/>акции
        </div>
        <div
          className={cx('navItem', { active: Tinder.myBusinessActiveTab === MY_BUSINESS_TABS.ACTIVE_PARTNERSHIPS })}
          onClick={() => Tinder.set('myBusinessActiveTab', MY_BUSINESS_TABS.ACTIVE_PARTNERSHIPS)}
        >
          Активные<br/>Сотрудничества
        </div>
        <div
          className={cx('navItem', { active: Tinder.myBusinessActiveTab === MY_BUSINESS_TABS.NEW_REQUESTS })}
          onClick={() => Tinder.set('myBusinessActiveTab', MY_BUSINESS_TABS.NEW_REQUESTS)}
        >
          Новые<br/>Предложения
        </div>
      </div>
      <div className={styles.navLine} />
    </div>
  );
});

export default observer(BusinessControls);
