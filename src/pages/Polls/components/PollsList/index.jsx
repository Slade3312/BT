import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { OverlayLoader } from 'components/common/Loaders/components';
import NotFoundList from 'components/common/NotFoundList';
import FiltersForm from 'pages/Polls/containers/Filters';
import CampaignGroup from 'pages/Polls/containers/CampaignGroup';
import styles from './styles.pcss';

const PollsList = () => {
  const { Polls: PollsStore } = useContext(StoresContext);
  return (
    <>
      <FiltersForm />
      <div className={styles.list}>
        <OverlayLoader isLoading={PollsStore.pollsListLoading} isTopPosition>
          <CampaignGroup />
          {!PollsStore.pollsList.length && !PollsStore.pollsListLoading && <NotFoundList/>}
        </OverlayLoader>
      </div>
    </>
  );
};

export default observer(PollsList);
