import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from 'utils/formatting';
import { StoresContext } from 'store/mobx';
import { Heading } from 'components/layouts';
import { ActionButton } from 'components/buttons/ActionButtons';
import { pushToGA } from 'utils/ga-analytics/data-layer';
import styles from './styles.pcss';

const TariffCard = ({ title, description, questionsCount, respondentsCount, budget, priceUrl, tariff_uid }) => {
  const { Polls, Templates } = useContext(StoresContext);
  const { buttonStart, buttonPrice } = Templates.getPollsTemplate('TariffCard');

  const handleModalOpen = () => {
    Polls.setIsOpened(true);
    Polls.modal.tariff_uid = tariff_uid;

    pushToGA({
      event: 'event_b2b',
      eventCategory: 'linkClick',
      eventAction: buttonStart,
      eventLabel: title,
    });
  };

  const handleClickPriceLink = () => {
    pushToGA({
      event: 'event_b2b',
      eventCategory: 'linkClick',
      eventAction: buttonPrice,
      eventLabel: title,
    });
  };

  return (
    <div className={styles.card}>
      <Heading className={styles.title}>{title}</Heading>

      <hr className={styles.delimiter} />

      <div className={styles.countsBlock}>
        <div className={styles.questions}>
          <span>Количество вопросов:</span>

          <span className={styles.count}>{questionsCount}</span>
        </div>

        <div className={styles.respondents}>
          <span>Количество анкет:</span>

          <span className={styles.count}>{respondentsCount}</span>
        </div>
      </div>

      <hr className={styles.delimiter} />

      <span className={styles.description}>{description}</span>

      <hr className={styles.delimiter} />

      <div className={styles.bottomBlock}>
        <div className={styles.priceContainer}>
          <span className={styles.result}>Итого:</span>

          <span className={styles.budget}>{formatPrice(budget)} ₽</span>
        </div>

        <ActionButton className={styles.button} onClick={handleModalOpen}>
          {buttonStart}
        </ActionButton>
      </div>

      <a
        href={priceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.priceList}
        onClick={handleClickPriceLink}
      >
        {buttonPrice}
      </a>
    </div>
  );
};

TariffCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  questionsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  respondentsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  budget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tariff_uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  priceUrl: PropTypes.string,
};

export default TariffCard;
