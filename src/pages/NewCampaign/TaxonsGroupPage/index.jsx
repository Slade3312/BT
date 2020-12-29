import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { navigate } from '@reach/router';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import { FeedbackBanner } from 'widgets';
import PageLayout from 'pages/_PageLayout';
import { BackLink } from 'components/buttons';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from 'containers/ChatWidget';

import { StepLayout, StepHeading } from '../components';
import {
  SegmentationWrapper,
  TaxonMapper,
  StepNavButton,
  TaxonomyStepForm,
} from '../containers';

import PhoneNumbersTaxonPage from './PhoneNumbersTaxonPage';
import WebSitesTaxonPage from './WebSitesTaxonPage';

const cx = classNames.bind(commonStyles);

function TaxonsGroupPage({ groupId, prevPathname, campaignId }) {
  const { NewCampaign } = useContext(StoresContext);

  const handleButtonSubmit = () => {
    if (prevPathname.includes('channels')) {
      navigate(prevPathname);
    } else {
      navigate('./');
    }
  };

  if (NewCampaign.currentCampaign.channel_uid === 'target-sms' || NewCampaign.currentCampaign.channel_uid === 'push') {
    if (groupId === 'webSites') {
      return <WebSitesTaxonPage campaignId={campaignId} prevPathname={prevPathname}/>;
    } else if (groupId === 'phoneNumbers') {
      return <PhoneNumbersTaxonPage campaignId={campaignId} prevPathname={prevPathname} />;
    }
  }

  return (
    <PageLayout>
      <TaxonomyStepForm>
        <SegmentationWrapper>
          <StepLayout isStretched>
            <BackLink className={cx('marb-s')} onClick={() => navigate(-1)} />

            <StepHeading
              className={cx('marb-m')}
              title={NewCampaign.taxonsGroupData[groupId] && NewCampaign.taxonsGroupData[groupId].name}
            />

            <TaxonMapper taxonsGroupId={groupId} />

            <StepNavButton className={cx('marv-s')} onClick={handleButtonSubmit}>
              Сохранить
            </StepNavButton>
          </StepLayout>
        </SegmentationWrapper>

        <FeedbackBanner className={cx('mart-s')} />
      </TaxonomyStepForm>

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}

TaxonsGroupPage.propTypes = {
  groupId: PropTypes.string,
  prevPathname: PropTypes.string,
  campaignId: PropTypes.string,
};

export default observer(TaxonsGroupPage);
