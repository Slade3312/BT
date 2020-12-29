import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';
import { CardsKeeper, TitleCard, Card } from 'pages/Dashboard/components';

const GoalsStack = ({ className }) => {
  const { Templates } = useContext(StoresContext);
  const { dashboard } = Templates.data;

  return (
    <CardsKeeper className={className}>
      <TitleCard title={dashboard?.GoalsStackCover?.title} />

      {dashboard?.GoalsStack?.items?.map(({ pricePrefix, price, href, iconUrl, title, description, id }) => (
        <Card
          pricePrefix={pricePrefix}
          price={price}
          href={href}
          iconUrl={iconUrl}
          title={title}
          description={description}
          key={id}
          isHoverable
        />
      ))}
    </CardsKeeper>
  );
};

GoalsStack.propTypes = {
  className: PropTypes.string,
};

export default observer(GoalsStack);
