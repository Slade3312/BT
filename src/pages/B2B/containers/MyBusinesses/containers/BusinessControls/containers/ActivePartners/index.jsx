import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import classNames from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import { BeautyScrollbar } from 'components/common/index';
import GlobalIcon from 'components/common/GlobalIcon';
import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';


const cx = classNames.bind(styles);

const ActivePartners = () => {
  const { Tinder } = useContext(StoresContext);
  const [isAwaitingOpened, setAwaitingOpened] = useState(false);
  const [isRejectedOpened, setRejectedOpened] = useState(false);
  const [isAppliedOpened, setAppliedOpened] = useState(false);
  useEffect(() => {
    Tinder.getMyPartners();
  }, []);

  if (Tinder.myPartnersLoading) {
    return (
      <>
        <div className={styles.itemWrapper}>
          <div className={cx('item', 'applied')}><Skeleton width={150} circle/></div>
          <div className={styles.badgeHolder}>
            <div><Skeleton width={20} height={20} circle/></div>
          </div>
        </div>
        <div className={styles.itemWrapper}>
          <div className={cx('item', 'rejected')}><Skeleton width={200} circle/></div>
          <div className={styles.badgeHolder}>
            <div><Skeleton width={20} height={20} circle/></div>
          </div>
        </div>
        <div className={styles.itemWrapper}>
          <div className={cx('item', 'awaiting')}><Skeleton width={150} circle/></div>
          <div className={styles.badgeHolder}>
            <div><Skeleton width={20} height={20} circle/></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <BeautyScrollbar className={styles.scroll}>
      <div className={styles.itemsList}>
        <div className={styles.itemWrapper} onClick={() => setAppliedOpened(!isAppliedOpened)}>
          <div className={cx('item', 'applied')}>Активные</div>
          <div className={styles.badgeHolder}>
            <div className={styles.badge}>{Tinder.actionsSortedbyStatus.applied.length}</div>
            { Tinder.actionsSortedbyStatus.applied.length && <GlobalIcon slug="dropdownArrow" className={cx('arrow', { openedArrow: isAppliedOpened })} /> || null}
          </div>
        </div>
        {
            Tinder.actionsSortedbyStatus.applied.map(request => {
              const direction = request.from_business.id === Tinder.activeBusinessId ? 'to' : 'from';
              return (
                <div className={cx('requestList', { activeList: isAppliedOpened })} key={request.id}>
                  <div className={styles.infoHolder}>
                    <div className={styles.icon} style={{
                      background: `url(${request[`${direction}_business`].industry_icon})`,
                      backgroundSize: 'cover',
                    }} />
                    <div className={styles.name}>{request[`${direction}_business`].name}</div>
                  </div>
                  <div className={styles.actionName}>{request[`${direction}_action`].name}</div>
                  <div className={styles.actionDescription}>{request[`${direction}_action`].description}</div>
                  <div className={styles.date}>с {moment(request[`${direction}_action`].date_start).format('DD.MM.YYYY')} до {moment(request[`${direction}_action`].date_end).format('DD.MM.YYYY')}</div>
                </div>
              );
            })
          }

      </div>

      <div className={styles.itemsList}>
        <div className={styles.itemWrapper} onClick={() => setAwaitingOpened(!isAwaitingOpened)}>
          <div className={cx('item', 'awaiting')}>Ожидают подтверждения</div>
          <div className={styles.badgeHolder}>
            <div className={styles.badge}>{Tinder.actionsSortedbyStatus.awaiting.length}</div>
            { Tinder.actionsSortedbyStatus.awaiting.length && <GlobalIcon slug="dropdownArrow" className={cx('arrow', { openedArrow: isAwaitingOpened })} /> || null }
          </div>
        </div>
        {
          Tinder.actionsSortedbyStatus.awaiting.map(request => {
            const direction = request.from_business.id === Tinder.activeBusinessId ? 'to' : 'from';
            return (
              <div className={cx('requestList', { activeList: isAwaitingOpened })} key={request.id}>
                <div className={styles.infoHolder}>
                  <div className={styles.icon} style={{
                    background: `url(${request[`${direction}_business`].industry_icon})`,
                    backgroundSize: 'cover',
                  }} />
                  <div className={styles.name}>{request[`${direction}_business`].name}</div>
                </div>
                <div className={styles.actionName}>{request[`${direction}_action`].name}</div>
                <div className={styles.actionDescription}>{request[`${direction}_action`].description}</div>
                <div className={styles.date}>с {moment(request[`${direction}_action`].date_start).format('DD.MM.YYYY')} до {moment(request[`${direction}_action`].date_end).format('DD.MM.YYYY')}</div>
              </div>
            );
          })
        }

      </div>

      <div className={styles.itemsList}>
        <div className={styles.itemWrapper} onClick={() => setRejectedOpened(!isRejectedOpened)}>
          <div className={cx('item', 'rejected')}>Отклонены</div>
          <div className={styles.badgeHolder}>
            <div className={styles.badge}>{Tinder.actionsSortedbyStatus.rejected.length}</div>
            { Tinder.actionsSortedbyStatus.rejected.length && <GlobalIcon slug="dropdownArrow" className={cx('arrow', { openedArrow: isRejectedOpened })} /> || null}
          </div>
        </div>
        {
          Tinder.actionsSortedbyStatus.rejected.map(request => {
            const direction = request.from_business.id === Tinder.activeBusinessId ? 'to' : 'from';
            return (
              <div className={cx('requestList', { activeList: isRejectedOpened })} key={request.id}>
                <div className={styles.infoHolder}>
                  <div className={styles.icon} style={{
                    background: `url(${request[`${direction}_business`].industry_icon})`,
                    backgroundSize: 'cover',
                  }} />
                  <div className={styles.name}>{request[`${direction}_business`].name}</div>
                </div>
                <div className={styles.actionName}>{request[`${direction}_action`].name}</div>
                <div className={styles.actionDescription}>{request[`${direction}_action`].description}</div>
                <div className={styles.date}>с {moment(request[`${direction}_action`].date_start).format('DD.MM.YYYY')} до {moment(request[`${direction}_action`].date_end).format('DD.MM.YYYY')}</div>
              </div>
            );
          })
        }

      </div>
    </BeautyScrollbar>
  );
};

export default observer(ActivePartners);
