import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames/bind';
import { StoresContext } from 'store/mobx';
import GlobalIcon from 'components/common/GlobalIcon';
import { convertActionByType } from 'pages/B2B/utils';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Item = (props) => {
  const { Tinder, TinderChat } = useContext(StoresContext);
  // const handleSendMessageClick = () => {
  //   if (Tinder.item.company) TinderChat.loadSearchChat(Tinder.item.company, Tinder.item.name);
  // };

  let isMyOwnBusiness = false;
  if (Tinder?.item?.id) {
    isMyOwnBusiness = Tinder.myBusinessesIdList.includes(Tinder.item.id);
  }

  return (
    <>
      <div className={styles.container}>

        <div className={styles.backContainer} onClick={() => {
          props.onBack ? props.onBack() : Tinder.backToIndustry(Tinder.item.industry);
        }}>
          <GlobalIcon slug="backSmallArrow" className={styles.backIcon}/>
          <span className={styles.backText}>Назад</span>
        </div>

        <div className={styles.infoContainer}>
          {
            Tinder.itemLoading ?
              <Skeleton circle height={40} width={40} /> :
              <div className={styles.listIcon} style={{
                background: `url(${Tinder.item.industry_icon})`,
                backgroundSize: 'cover',
              }} />
            }
          <div className={styles.itemName}>{Tinder.itemLoading ? <Skeleton width={200} height={30} /> : Tinder.item.name}</div>
        </div>
        <div className={styles.address}>{Tinder.itemLoading ? <Skeleton width={260} /> : Tinder.item.address}</div>
        {
          !isMyOwnBusiness &&
          <div className={styles.salesText}>Акции бизнеса:</div>
        }
      </div>
      {
        !isMyOwnBusiness &&
        <ItemsList />
      }

      {/*
        !isMyOwnBusiness &&
        <div className={styles.buttonsHolder}>
          <ActionButton
            iconSlug="arrowRightMinimal"
            onClick={handleSendMessageClick}
          >
            Написать сообщение
          </ActionButton>
        </div>
      */}
    </>
  );
};

const ItemsList = observer(() => {
  const { Tinder } = useContext(StoresContext);
  return (
    <>
      {
        Tinder.itemLoading &&
        <LoadingItemsList />
      }

      {
        !Tinder.itemLoading &&
        Tinder.item.business_actions.map(action => {
          return (
            <>
              <div
                className={cx('listElement', { active: Tinder.getActiveActionId === action.id })}
                key={action.id}
                onClick={() => {
                  Tinder.openModalPartners({ businessId: Tinder.item.id, actionId: action.id });
                }}
              >
                <div className={styles.infoContainer}>
                  <div className={styles.saleDescription}>{action.name}</div>
                </div>
                <div className={styles.saleDates}>
                  {action.discount_size}{convertActionByType(action.discount_type)} с {moment(action.date_start).format('DD.MM.YYYY')} до {moment(action.date_end).format('DD.MM.YYYY')}
                </div>
              </div>
              <div className={styles.divider} />
            </>
          );
        })
      }
    </>
  );
});

const LoadingItemsList = () => {
  return (
    <>
      <div className={styles.listElementSkeleton}>
        <div className={styles.infoContainer}>
          <div className={styles.saleDescription}><Skeleton width={260} height={17}/></div>
        </div>
        <div className={styles.saleDates}><Skeleton width={260} height={13}/></div>
      </div>
      <div className={styles.divider} />

      <div className={styles.listElementSkeleton}>
        <div className={styles.infoContainer}>
          <div className={styles.saleDescription}><Skeleton width={260} height={17}/></div>
        </div>
        <div className={styles.saleDates}><Skeleton width={260} height={13}/></div>
      </div>
      <div className={styles.divider} />
    </>
  );
};

Item.propTypes = {
  onBack: PropTypes.any,
};

export default observer(Item);
