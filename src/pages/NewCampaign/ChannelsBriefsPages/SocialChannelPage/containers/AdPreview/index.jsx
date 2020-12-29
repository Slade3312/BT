import React, { useContext } from 'react';
import { useLocalStore, useObserver, observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';

const noImage = 'https://static.beeline.ru/upload/images/marketing/downloadimage.svg';

const AdPreview = () => {
  const state = useLocalStore(() => ({
    screen: 'teaser',
  }));
  return useObserver(() => (
    <>
      <div className={styles.navigationContainer}>
        <div
          className={`${styles.navigationItem} ${state.screen === 'teaser' ? styles.active : null}`}
          onClick={() => { state.screen = 'teaser'; }}
        >
          Тизер</div>
        <div
          className={`${styles.navigationItem} ${state.screen === 'banner' ? styles.active : null}`}
          onClick={() => { state.screen = 'banner'; }}
        >
          Баннер</div>
        <div
          className={`${styles.navigationItem} ${state.screen === 'post' ? styles.active : null}`}
          onClick={() => { state.screen = 'post'; }}
        >
          Пост</div>
      </div>
      <div className={styles.placeholder}>
        {
            (state.screen === 'teaser' &&
            <Teaser />) ||
            (state.screen === 'banner' &&
            <Banner />) ||
            (state.screen === 'post' &&
            <Post />)
        }
      </div>
    </>
  ));
};

const Teaser = observer(() => {
  const { Social } = useContext(StoresContext);
  return (
    <div className={styles.teaserContainer}>
      <div src={Social.teaserImg || noImage}
        style={{
          backgroundImage: `url(${Social.getTeaserImg?.file_path || noImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: Social.getTeaserImg ? 'contain' : 'inherit',
          backgroundPosition: 'center',
        }}
        className={styles.teaserImg}
        alt={Social.mainImg?.name}
      />

      <div className={styles.teaserInfoHolder}>
        <div className={styles.teaserHeader}>
          {Social.getAdTitle}
        </div>
        <div className={styles.teaserDescription}>
          {Social.getAdDescription}
        </div>
      </div>
    </div>
  );
});

const Banner = () => {
  const { Social } = useContext(StoresContext);
  return useObserver(() => (
    <div className={styles.bannerContainer}>
      <div
        style={{
          backgroundImage: `url(${Social.getTeaserImg?.file_path || noImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: Social.getTeaserImg ? 'contain' : 'inherit',
          backgroundPosition: 'center',
        }}
        className={styles.bannerImg}
      />
      <div className={styles.bannerHeader}>
        {Social.getAdTitle}
      </div>
      <div className={styles.bannerDescription}>
        {Social.getAdDescription}
      </div>
      <div className={styles.bannerButton}>
        {Social.getButtonText}
      </div>
    </div>
  ));
};

const Post = () => {
  const { Social } = useContext(StoresContext);
  return useObserver(() => (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <div
          className={styles.postLogo}
          style={{
            backgroundImage: `url(${Social.getLogo?.file_path || noImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: Social.getLogo ? 'contain' : 'inherit',
            backgroundPosition: 'center',
          }}
          alt={Social.logo?.name}
        />
        <div className={styles.postTitle}>
          {Social.getAdTitle}
        </div>
      </div>
      <div className={styles.postDescription}>
        {Social.getAdDescription}
      </div>
      <div
        style={{
          backgroundImage: `url(${Social.getPostImg?.file_path || noImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: Social.getPostImg ? 'contain' : 'inherit',
          backgroundPosition: 'center',
        }}
        className={styles.postImg}
      />
      <div className={styles.postBtn}>{Social.getButtonText}</div>
    </div>
  ));
};

export default AdPreview;
