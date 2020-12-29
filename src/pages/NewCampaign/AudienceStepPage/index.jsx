import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useNavigate, useParams } from '@reach/router';
import classNames from 'classnames/bind';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import PageLayout from 'pages/_PageLayout';
import { SubHeadline } from 'components/layouts';
import { FeedbackBanner } from 'widgets';
import { FormFieldLabel } from 'components/forms';
import { FFRadioGroup } from 'components/fields';
import RadioDefaultButton from 'components/fields/_parts/RadioDefaultButton';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from 'containers/ChatWidget';
import { GEO_TYPE_ACTION } from 'store/NewCampaign/channels/constants';

import {
  StepLayout,
  SectionSplitLine,
  StepHeading,
} from '../components';
import {
  StepNavButton,
  SegmentationWrapper,
  TaxonomyStepForm,
  GeoTaxonWidget,
} from '../containers';
import TaxonsGroupsTable from '../containers/TaxonsGroupsTable';
import { CHANNEL_STUB_SMS, GEO_TYPES, geoActionOptions } from '../../../constants';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles, ...commonStyles });

function AudienceStepPage() {
  const { Templates: { getNewCampaignTemplate }, NewCampaign, WebsAndPhonesTaxons } = useContext(StoresContext);

  const {
    title,
    subTitle,
    buttonText,
    taxonsDescription,
  } = getNewCampaignTemplate('CampaignTaxonsStep');

  const { geoAction, geoActionPointsLabel, geoActionRegionLabel } = getNewCampaignTemplate('StepAudienceContent');

  const geoRadioOptions = [
    { value: GEO_TYPES.REGIONS, label: geoActionRegionLabel },
    { value: GEO_TYPES.POINTS, label: geoActionPointsLabel },
  ];

  const navigate = useNavigate();
  const params = useParams();

  const handleButtonClick = () => {
    navigate(`/new-campaign/${params.campaignId}/channels/${NewCampaign.currentCampaign.channel_uid}`);
  };

  useEffect(() => {
    WebsAndPhonesTaxons.defineCurrentOnOfLine();
    if (
      WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
        NewCampaign.currentCampaign.channel_uid === CHANNEL_STUB_SMS
    ) {
      NewCampaign.resetOnlineGeoAudience();
    }
  }, []);


  return (
    <PageLayout>
      <TaxonomyStepForm>
        <SegmentationWrapper>
          <StepLayout isStretched>
            <StepHeading
              className={cx('marb-m', 'stepContentWidth')}
              title={title}
              description={subTitle}
            />

            <FormFieldLabel tooltip={geoAction?.tooltip} isBold className={cx('marb-xxs')}>
              {geoAction?.label}
            </FormFieldLabel>

            <SubHeadline className={cx('marb-s', 'stepContentWidth')}>{geoAction?.description}</SubHeadline>

            <FFRadioGroup
              ItemComponent={RadioDefaultButton}
              defaultValue={geoActionOptions[0].value}
              options={geoRadioOptions}
              name={GEO_TYPE_ACTION}
            />

            <GeoTaxonWidget />

            <SectionSplitLine className={cx('mart-m', 'marb-m')} />

            <SubHeadline className={cx('marb-xs', 'description')}>
              {taxonsDescription}
            </SubHeadline>

            <TaxonsGroupsTable />

            <StepNavButton onClick={handleButtonClick} className={cx('marv-s')}>{buttonText}</StepNavButton>
          </StepLayout>
        </SegmentationWrapper>

        <FeedbackBanner className={cx('mart-s')} />
      </TaxonomyStepForm>

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}

export default observer(AudienceStepPage);

