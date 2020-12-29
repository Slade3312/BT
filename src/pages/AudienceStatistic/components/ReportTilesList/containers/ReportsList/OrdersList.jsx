import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { ORDER_STATUSES } from 'constants/index';
import OrdersItem from './OrdersItem';

const OrdersList = () => {
  const { Audience } = useContext(StoresContext);
  return (
    <>
      {Audience.campaignsList.map(({ id, orders, name }) => {
        const isCompleted = orders.length && orders[0].status_id === ORDER_STATUSES.COMPLETED || false;
        return (
          <OrdersItem
            isCompleted={isCompleted}
            id={id}
            key={id}
            orders={orders}
            name={name}
          />
        );
      })}
    </>
  );
};

export default observer(OrdersList);
