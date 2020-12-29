import React, { useContext, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { BeautyScrollbar } from 'components/common';
import { SearchInput } from 'components/fields/TextInput';
import GlobalIcon from 'components/common/GlobalIcon';
import styles from './styles.pcss';


const IndustryItems = observer(() => {
  const { Tinder } = useContext(StoresContext);
  useEffect(() => {
    Tinder.objectManager.setFilter('id');
  }, []);
  return (
    <>
      <div className={styles.containerSearch}>
        <div className={styles.backContainer} onClick={Tinder.goToIndustriesList}>
          <GlobalIcon slug="backSmallArrow" className={styles.backIcon}/>
          <span className={styles.backText}>Назад</span>
        </div>

        <SearchInput
          placeholder="Введите нужный бизнес"
          value={Tinder.businessesListInput}
          onChange={e => Tinder.set('businessesListInput', e)}
          className={styles.search}
        />
      </div>

      <CategoriesList />

    </>
  );
});

const CategoriesList = observer(() => {
  const { Tinder } = useContext(StoresContext);
  return (
    <BeautyScrollbar className={styles.wrapper}>
      {
        Tinder.industryLoading &&
        <>
          <div className={styles.skeletonListElement}>
            <Skeleton height={30} className={styles.skeletonItem} />
            <Skeleton height={15} className={styles.skeletonItem}/>
            <Skeleton height={15}/>
          </div>
          <div className={styles.skeletonListElement}>
            <Skeleton height={30} className={styles.skeletonItem} />
            <Skeleton height={15} className={styles.skeletonItem}/>
            <Skeleton height={15}/>
          </div>
          <div className={styles.skeletonListElement}>
            <Skeleton height={30} className={styles.skeletonItem} />
            <Skeleton height={15} className={styles.skeletonItem}/>
            <Skeleton height={15}/>
          </div>
          <div className={styles.skeletonListElement}>
            <Skeleton height={30} className={styles.skeletonItem} />
            <Skeleton height={15} className={styles.skeletonItem}/>
            <Skeleton height={15}/>
          </div>
        </>
      }

      {
        Tinder.getBusinessesList.map(item => {
          return (
            <div className={styles.listElement} onClick={() => Tinder.goToItem(item.id)} key={item.id}>
              <div className={styles.infoContainer}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemSale}>Активных акций: {item.actions_count}</div>
              </div>
              <GlobalIcon slug="iconLeftList" className={styles.icon}/>
            </div>
          );
        })
      }

    </BeautyScrollbar>
  );
});

export default IndustryItems;
