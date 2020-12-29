import React, { useContext, useRef, useEffect } from 'react';
import { StoresContext } from 'store/mobx';
import { Heading } from 'components/layouts';
import { scrollSmoothTo } from 'utils/scroll';
import { useNormalizedLocation } from 'hooks/use-normalized-location';
import styles from './styles.pcss';
import ContactForm from './containers/ContactForm';


const WebinarSubscribe = () => {
  const { Templates: { getWebinarSubscribe } } = useContext(StoresContext);
  const container = useRef();
  const header = getWebinarSubscribe('header');
  const description = getWebinarSubscribe('description');
  const speakersTitle = getWebinarSubscribe('speakersTitle');
  const speakersList = getWebinarSubscribe('speakersList', []);
  const { hash } = useNormalizedLocation();
  useEffect(() => {
    if (hash === '#webinar') {
      scrollSmoothTo(container.current.getBoundingClientRect().top);
    }
  }, [hash]);
  return (
    <div className={styles.container} ref={container}>
      <div className={styles.header}>

        <Heading level={3} className={styles.webinarTitle}>
          {header}
        </Heading>

      </div>

      <div className={styles.body}>
        <div className={styles.content}>

          <p className={styles.textRegular}>
            {description}
          </p>

          <div className={styles.title}>{speakersTitle}</div>

          {
            speakersList.map(item =>
              (
                <div className={styles.speakerRow} key={item.name}>
                  <img
                    src={item.photo}
                    alt={item.name}
                    className={styles.speakerPhoto}
                  />
                  <div className={styles.speakerInfo}>
                    <div className={styles.speakerName}>
                      {item.name}
                    </div>
                    <div className={styles.speakerDescription}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))
          }
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default WebinarSubscribe;
