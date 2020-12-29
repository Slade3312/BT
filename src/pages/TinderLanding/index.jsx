import React, { useContext, useEffect } from 'react';
import { navigate } from '@reach/router';
import { observer } from 'mobx-react';
import { TINDER_URL } from 'pages/constants';
import { ActionButton } from 'components/buttons/ActionButtons';
import { StoresContext } from '../../store/mobx';
import { Preloader } from '../../components/common';
import styles from './styles.pcss';


const TinderLanding = () => {
  const { Tinder, Authorization } = useContext(StoresContext);
  useEffect(() => {
    Tinder.getMyBusinesses();
  }, []);
  const onStartClick = () => {
    Tinder.set('isLandingShowed', true);
    navigate(TINDER_URL);
    if (!Tinder.isIntroFinished) {
      Tinder.set('introStep', 1);
    }
  };
  if (Authorization.isLoggedIn && Tinder.isInitialDataLoading) return <Preloader />;
  return (
    <main className={styles.content}>
      <section className={styles.top}>
        <div className={styles.container}>
          <div className={styles.topContainer}>
            <h1 className={styles.title}>Бизнес.Вместе</h1>
            <div className={styles.listItem}>Создайте свою сеть партнерств</div>
            <div className={styles.listItem}>Обменивайтесь клиентской базой</div>
            <div className={styles.listItem}>Увеличивайте продажи без вложения в рекламу</div>
            <ActionButton className={styles.btn} iconSlug="arrowRightMinimal" onClick={onStartClick}>Начать сотрудничество</ActionButton>
          </div>
        </div>
      </section>

      <section className={styles.markYourCompany}>
        <div className={`${styles.container} ${styles.markYourCompanyContainer}`}>
          <div className={styles.markYourCompanyDescription}>
            <h3 className={styles.sectionHeader}>Отметьте свою компанию на карте</h3>
            <p className={styles.sectionDescription}>
              Добавьте свой бизнес на карту, чтобы находить партнеров поблизости и получать предложения о сотрудничестве.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.placeAction}>
        <div className={`${styles.container} ${styles.placeActionContainer}`}>
          <div className={styles.placeActionDescription}>
            <h3 className={styles.sectionHeader}>Разместите акцию</h3>
            <p className={styles.sectionDescription}>
              Добавьте в личном кабинете свое предложение — скидку или акцию. О них будут рассказывать своим клиентам ваши партнеры.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.findPartner}>
        <div className={`${styles.container} ${styles.findPartnerContainer}`}>
          <div className={styles.findPartnerDescription}>

            <h3 className={styles.sectionHeader}>Найдите партнера</h3>

            <p className={styles.sectionDescription}>
              Ищите компании рядом с вами и предлагайте им стать партнерами. Вы будете рекомендовать друг друга клиентам и вместе увеличивать продажи.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.placeAction}>
        <div className={`${styles.container} ${styles.changeClientContainer}`}>
          <div className={styles.changeClientDescription}>

            <h3 className={styles.sectionHeader}>Обменивайтесь клиентами</h3>

            <p className={styles.sectionDescription}>
              Партнеры расскажут клиентам о ваших спецпредложениях, а вы — об акциях партнеров. Так вы приведете друг другу новых покупателей и сэкономите на рекламе.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.apps}>
        <div className={styles.greyPlaceholder} />
        <div className={`${styles.container} ${styles.appsContainer}`}>
          <div className={styles.appsDescription}>
            <div>
              <h3 className={styles.sectionHeader}>Приложения «Бизнес.Вместе»</h3>
            </div>
            <div className={styles.sectionDescription}>
              Совсем скоро для ваших клиентов мы запустим мобильное приложение. В нем люди будут искать скидки рядом с собой и приходить к вам без дополнительной рекламы. Если  у вас будут партнеры в сервисе, вы автоматически попадете в каталог приложения.
            </div>
          </div>
          <div className={styles.phoneHolder} />
        </div>
      </section>

      <section className={styles.results}>
        <div className={styles.resultsHolder}>
          <div className={styles.resultsText}>
            <h3 className={styles.sectionHeaderBottom}>Результат сотрудничества</h3>
            <div className={styles.sectionDescriptionResults}>
              Вы бесплатно получите новых клиентов по рекомендациям компаний-партнеров и через приложение. Стройте свою сеть партнерств и помогайте развиваться бизнесу друг друга совершенно бесплатно.
            </div>
          </div>
          <ActionButton className={styles.btnBottom} iconSlug="arrowRightMinimal" onClick={onStartClick}>Начать</ActionButton>
        </div>
      </section>

    </main>
  );
};

export default observer(TinderLanding);
