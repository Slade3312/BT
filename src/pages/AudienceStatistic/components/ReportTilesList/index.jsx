import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { PaginatorLayout } from 'components/layouts';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import ReportsList from './containers/ReportsList';

const cx = classNames.bind(commonStyles);

function ReportTilesList() {
  const { Audience: {
    nextPageLink,
    campaignsListLoading,
    getNextCampaigns,
    nextCount,
  } } = useContext(StoresContext);
  return (
    <>
      <ReportsList />
      {(nextPageLink && nextCount) && (
        <PaginatorLayout
          className={cx('marb-xl')}
          nextCount={nextCount}
          isLoading={campaignsListLoading}
          onClick={getNextCampaigns}
        />
      ) || null}
    </>
  );
}

export default observer(ReportTilesList);
