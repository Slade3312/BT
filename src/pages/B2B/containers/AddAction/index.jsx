import React from 'react';
// import { observer } from 'mobx-react';
import GlobalIcon from 'components/common/GlobalIcon';
import styles from './styles.pcss';

const AddAction = () => {
  return (
    <>
      <div className={styles.backContainer}>
        <GlobalIcon slug="backSmallArrow" className={styles.backIcon}/>
        <span className={styles.backText}>На главную страницу</span>
      </div>
      <div className={styles.header}>Добавить акцию</div>
      <div className={styles.description}>Выберите бизнес, для которого<br/> вы хотите добавить скидку</div>
      <div className={styles.list}>

        <div className={styles.listItem}>
          <div className={styles.itemDescription}>

            <div className={styles.itemTitle}>
              <div className={styles.logo} />

              <div className={styles.infoHolder}>
                <div className={styles.itemName}>
                  Matador
                </div>
                <div className={styles.address}>
                  Красноармейская ул., 90
                </div>
                <div className={styles.sales}>
                  Кол-во акций: <span className={styles.salesNumber}>3</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.iconList}>
            <GlobalIcon slug="iconLeftListBig" />
          </div>
        </div>

        <div className={styles.listItem}>
          <div className={styles.itemDescription}>
            <div className={styles.itemTitle}>
              <div className={styles.logo} />
              <div className={styles.infoHolder}>
                <div className={styles.itemName}>
                  Matador
                </div>
                <div className={styles.address}>
                  Красноармейская ул., 90
                </div>
                <div className={styles.sales}>
                  Кол-во акций: <span className={styles.salesNumber}>3</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.iconList}>
            <GlobalIcon slug="iconLeftListBig" />
          </div>
        </div>

        <div className={`${styles.listItem} ${styles.disabled}`}>
          <div className={styles.itemDescription}>
            <div className={styles.itemTitle}>
              <div className={styles.logo} />
              <div className={styles.infoHolder}>
                <div className={styles.itemName}>
                  Matador
                </div>
                <div className={styles.address}>
                  Красноармейская ул., 90
                </div>
                <div className={styles.onModeration}>
                  <GlobalIcon slug="clock" /> Находится на модерации
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAction;
