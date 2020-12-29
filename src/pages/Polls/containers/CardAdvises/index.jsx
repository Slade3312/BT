import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';
import { getRandomInt } from 'utils/fn';

import { CardInfo } from 'components/common';

const CardAdvises = ({ className }) => {
  const { Templates: { getPollsTemplate } } = useContext(StoresContext);
  const { items = [] } = getPollsTemplate('AdvisesCards');

  const [currentTipIndex, setCurrentTipIndex] = useState(getRandomInt(0, items?.length - 1));
  const { button, description, icon, title } = items[currentTipIndex] || {};

  const handleCardInfoClick = (e) => {
    e.preventDefault();
    setCurrentTipIndex(prev => (prev < items?.length - 1 ? prev + 1 : 0));
  };

  return (
    <CardInfo
      currentContentIndex={currentTipIndex}
      title={title}
      iconSlag={icon || 'question'}
      buttonText={items.length > 1 ? button : ''}
      description={description}
      className={className}
      onButtonClick={handleCardInfoClick}
    />
  );
};

CardAdvises.propTypes = {
  className: PropTypes.string,
};

export default observer(CardAdvises);
