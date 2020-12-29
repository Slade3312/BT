import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { SearchInput } from 'components/fields/TextInput';
import { BeautyScrollbar } from 'components/common';
import GlobalIcon from 'components/common/GlobalIcon';
import styles from './styles.pcss';

const PartnersList = () => {
  const { Tinder } = useContext(StoresContext);
  const onChange = (val) => {
    Tinder.set('partnersListInput', val);
  };
  return (
    <>
      <div className={styles.container}>
        <SearchInput
          placeholder="Введите нужную отрасль"
          value={Tinder.partnersListInput}
          onChange={onChange}
          className={styles.search}
        />
      </div>
      <CategoriesList />
    </>
  );
};

const CategoriesList = observer(() => {
  const { Tinder } = useContext(StoresContext);
  if (!Tinder.getIndustriesList.length) {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.text}>Извините, ничего не найдено</div>
      </div>
    );
  }
  return (
    <BeautyScrollbar className={styles.scrollContainer}>
      <div className={styles.innerContainer}>
        {
          Tinder.getIndustriesList.length &&
          <div className={styles.listElement} onClick={() => Tinder.goToIndustry()}>
            <GlobalIcon slug="allItems" />
            <span className={styles.text}>Все места </span><GlobalIcon slug="iconLeftList" className={styles.icon}/>
          </div>
        }
        {
          Tinder.getIndustriesList.map(item => {
            return (
              <div className={styles.listElement} key={item.value} onClick={() => Tinder.goToIndustry(item.value)}>
                <div className={styles.listIcon} style={{
                  background: `url(${item.icon})` || '#cacaca',
                  backgroundSize: 'cover',
                }} />
                <span className={styles.text}>{item.label} </span><GlobalIcon slug="iconLeftList" className={styles.icon}/>
              </div>
            );
          })
        }
      </div>
    </BeautyScrollbar>
  );
});

export default observer(PartnersList);
