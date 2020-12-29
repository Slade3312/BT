import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { ActionButton } from 'components/buttons';
import { StoresContext } from 'store/mobx';
import { BeautyScrollbar } from 'components/common';
import GlobalIcon from 'components/common/GlobalIcon';
import styles from './styles.pcss';

const MyBusiness = () => {
  const { Tinder } = useContext(StoresContext);
  return (
    <>
      <BeautyScrollbar className={styles.wrapper}>
        {
          Tinder.myBusiness.map(item => {
            return (
              <div
                className={styles.item}
                key={item.id}
                onClick={() => Tinder.goToBusiness(item.id)}
              >
                <div className={styles.container}>
                  <div className={styles.infoContainer}>
                    <div className={styles.listIcon} style={{
                      background: item.industry_icon && `url(${item.industry_icon})` || '#cfcfcf',
                      backgroundSize: 'contain',
                    }}>
                      { item.pending_partnership && <div className={styles.badge}>{item.pending_partnership}</div> || null }
                    </div>
                    <div className={styles.itemName}>{item.name}</div>
                  </div>
                  <div className={styles.address}>{item.address}</div>
                  {
                    item.moderation_status === 0 &&
                    <div className={styles.onModeration}>
                      <GlobalIcon slug="clock" />
                      <span className={styles.onModerationText}>Находится на модерации</span>
                    </div>
                  }
                </div>
                <GlobalIcon slug="iconLeftList" className={styles.icon}/>
              </div>
            );
          })
        }
      </BeautyScrollbar>
      <Buttons />
    </>
  );
};

const Buttons = () => {
  const { Tinder } = useContext(StoresContext);
  return (
    <div className={styles.buttonsHolder}>
      <ActionButton
        iconSlug="arrowRightMinimal"
        onClick={() => Tinder.set('showModalAddBusiness', true)}
        className={styles.business}
      >
        Добавить бизнес
      </ActionButton>
    </div>
  );
};

export default observer(MyBusiness);
