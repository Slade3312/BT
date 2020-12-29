import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { StoresContext } from 'store/mobx';
import { ActionButton } from 'components/buttons/ActionButtons';
import Stepper from '../Stepper';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const text = [{
  title: 'Выберите бизнес для сотрудничества',
  description: 'Найдите бизнес с которым вы хотели бы сотрудничать с помощью карты или списка',
  image: 'https://static.beeline.ru/upload/images/marketing/B2B/step1.png',
}, {
  title: 'Выберите акцию у бизнеса',
  description: 'Найдите интересующую вас акцию',
  image: 'https://static.beeline.ru/upload/images/marketing/B2B/step2.png',
}, {
  title: 'Выберите свою акцию для сотрудничества',
  description: 'Выберите свою акцию, которую вы бы хотели отдать для сотрудничества',
  image: 'https://static.beeline.ru/upload/images/marketing/B2B/step3.png',
}, {
  title: 'Состояние сотрудничества',
  description: 'Просматривайте состояние вашей зявки в личном кабинете',
  image: 'https://static.beeline.ru/upload/images/marketing/B2B/step4.png',
}];

const Instructions = () => {
  const { Tinder } = useContext(StoresContext);
  const [opened, setStepOpened] = useState(0);
  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <Stepper />
        <div className={styles.header}>Найти сотрудничество</div>
        <div className={styles.listHolder}>
          {
            text.map((item, index) => {
              return (
                // eslint-disable-next-line
                <div className={styles.itemHolder} key={index}>
                  <div className={cx({ dotHolderLastItem: index === text.length - 1 }, { dotHolder: index !== text.length - 1 })}>
                    <div className={cx('dot', { active: opened === index })} onClick={() => setStepOpened(index)}>
                      { opened !== index && <div className={styles.blackDot}/> || null }
                    </div>
                  </div>
                  <div>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={cx('description', { opened: opened === index })}>{item.description}</div>
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className={styles.btnHolder}>
          <div className={styles.backBtn} iconSlugBefore="arrowRightMinimal" onClick={() => Tinder.set('introStep', 2)}>
            &lsaquo; <span className={styles.backBtnText}>Назад</span>
          </div>
          <ActionButton iconSlug="arrowRightMinimal" onClick={() => { Tinder.startWork(); }}>
            Начать работу
          </ActionButton>
        </div>
      </div>
      <img src={text[opened].image} className={styles.img} alt="" />
    </div>
  );
};

export default observer(Instructions);
