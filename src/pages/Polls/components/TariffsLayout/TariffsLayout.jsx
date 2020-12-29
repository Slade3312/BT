import React from 'react';
import PropTypes from 'prop-types';
import { ExoticHeading } from 'components/layouts';
import TariffCard from 'pages/Polls/components/TariffCard/TariffCard';

import styles from './styles.pcss';

const TariffsLayout = ({ title, tariffs }) => {
  return (
    <>
      <ExoticHeading
        level={2}
        className={styles.mainTitle}
      >
        {title}
      </ExoticHeading>

      <div className={styles.container}>
        {Array.from(tariffs).map(item => (
          <TariffCard
            key={item.name}
            title={item.name}
            description={item.description}
            questionsCount={item.question_count}
            respondentsCount={item.polled_count}
            budget={item.budget}
            priceUrl={item.price_url}
            tariff_uid={item.tariff_uid}
          />
        ))}
      </div>
    </>
  );
};

TariffsLayout.propTypes = {
  title: PropTypes.string,
  tariffs: PropTypes.object,
};

export default TariffsLayout;
