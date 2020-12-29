import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { PaginatorLayout } from 'components/layouts';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import { OverlayLoader } from 'components/common/Loaders/components';
import NotFoundList from 'components/common/NotFoundList';
import CampaignGroup from '../CampaignGroup';

import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

function CampaignsList() {
  const { MyCampaigns: { campaigns, isLoading, hasNextPageData, nextCount, syncAddMyCampaigns } } = useContext(StoresContext);

  return (
    <React.Fragment>
      <OverlayLoader isLoading={isLoading} isTopPosition>
        <ul className={cx('component', 'marb-xl')}>
          {campaigns.map(item => (
            <CampaignGroup
              key={item.id}
              item={item}
            />
          ))}
          {!campaigns.length && !isLoading && <NotFoundList/>}
        </ul>
      </OverlayLoader>


      {hasNextPageData && (
        <PaginatorLayout
          nextCount={nextCount}
          isLoading={isLoading}
          onClick={syncAddMyCampaigns}
          className={cx('marb-xl')}
        />
      )}
    </React.Fragment>
  );
}


export default observer(CampaignsList);
