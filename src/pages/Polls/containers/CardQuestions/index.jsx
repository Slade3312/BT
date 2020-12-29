import React, { useContext } from 'react';
import { navigate } from '@reach/router';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';

import { CardInfo } from 'components/common';
import { Heading } from 'components/layouts';

import styles from './styles.pcss';

const CardQuestions = ({ className }) => {
  const { Templates: { getPollsTemplate } } = useContext(StoresContext);
  const { buttonText, question, answer, icon, title, buttonHref } = getPollsTemplate('QuestionsCard');

  const handleCardInfoClick = (e) => {
    e.preventDefault();
    navigate(buttonHref);
  };

  return (
    <CardInfo
      title={title}
      iconSlag={icon || 'question'}
      buttonText={buttonText}
      className={className}
      onButtonClick={handleCardInfoClick}
    >
      <h3 className={styles.question}>{question}</h3>

      <Heading level={5} className={styles.answer}>{answer}</Heading>
    </CardInfo>
  );
};

CardQuestions.propTypes = {
  className: PropTypes.string,
};

export default observer(CardQuestions);
