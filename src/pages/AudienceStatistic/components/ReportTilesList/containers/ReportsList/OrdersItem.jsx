import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Tooltip from 'components/common/Tooltip';
import { GlobalIcon } from 'components/common';
import { StoresContext } from 'store/mobx';
import { TileWrapper } from 'pages/AudienceStatistic/components/ReportTile/components';
import NameCol from '../../../ReportTile/containers/NameCol';
import StatusCol from '../../../ReportTile/containers/StatusCol';
import DateCol from '../../../ReportTile/containers/DateCol';
import ButtonControlsCol from '../../../ReportTile/containers/ButtonControlsCol';
import styles from './styles.pcss';

const OrdersItem = ({ id, isCompleted, orders, name }) => {
  const { Audience } = useContext(StoresContext);
  const [loading, setLoading] = useState(false);
  const updateOrders = async () => {
    if (!loading) {
      setLoading(true);
      await Audience.getCampaignsWithoutLoading();
      setLoading(false);
    }
  };
  return (
    <TileWrapper className={styles.row}>
      <NameCol isLimited><span className={styles.name}>{name}</span></NameCol>
      <StatusCol>
        {
          isCompleted &&
          <span>Готов</span> ||
          <span>В процессе <Tooltip>Отчёт будет готов через несколько минут. Нажмите <div className={styles.reloadTooltip}><GlobalIcon slug="reload"/></div> для проверки готовности.</Tooltip></span>
        }
      </StatusCol>
      <DateCol />
      <ButtonControlsCol
        isOrderInCompleted={isCompleted}
        campaignId={id}
        orderId={orders.length && orders[0].id || null}
      />
      <div className={`${styles.reloadBtn} ${loading && styles.loading}`} onClick={updateOrders}>
        {loading &&
          <GlobalIcon slug="updating"/> ||
          <GlobalIcon slug="reload" />
        }
      </div>
    </TileWrapper>
  );
};

OrdersItem.propTypes = {
  orders: PropTypes.array,
  id: PropTypes.string,
  isCompleted: PropTypes.bool,
  name: PropTypes.string,
};

export default observer(OrdersItem);
