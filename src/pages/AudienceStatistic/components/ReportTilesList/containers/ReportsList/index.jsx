import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { OverlayLoader } from 'components/common/Loaders';
import NotFoundList from 'components/common/NotFoundList';
import ReportFilter from '../../../ReportFilter';
import OrdersList from './OrdersList';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function ReportsList() {
  const { Audience } = useContext(StoresContext);
  return (
    <div className={cx('component')}>
      <ReportFilter className={cx('header')} />
      <OverlayLoader isLoading={Audience.campaignsListLoading} isTopPosition>
        <OrdersList />
        {!Audience.campaignsList.length && !Audience.campaignsListLoading && <NotFoundList/>}
      </OverlayLoader>
    </div>
  );
}

export default observer(ReportsList);
