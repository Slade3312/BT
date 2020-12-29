import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ExoticHeading, Heading } from 'components/layouts';
import { ActionButton } from 'components/buttons/ActionButtons';
import { StoresContext } from 'store/mobx';

import styles from './styles.pcss';

const MainBannerLayout = ({ title, secondTitle, description, button, imgUrl }) => {
  const { Polls } = useContext(StoresContext);

  const handleModalOpen = () => Polls.setIsOpened(true);

  return (
    <>
      <ExoticHeading level={2} className={styles.mainTitle}>{title}</ExoticHeading>

      <div className={styles.mainBannerContainer}>
        <div>
          <Heading level={3} className={styles.secondTitle}>{secondTitle}</Heading>

          <Heading level={5} className={styles.description}>{description}</Heading>

          <ActionButton className={styles.button} onClick={handleModalOpen}>
            {button}
          </ActionButton>
        </div>

        <img src={imgUrl} alt="mainBanner" className={styles.image} />
      </div>
    </>
  );
};

MainBannerLayout.propTypes = {
  title: PropTypes.string,
  secondTitle: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.string,
  imgUrl: PropTypes.string,
};

export default MainBannerLayout;
