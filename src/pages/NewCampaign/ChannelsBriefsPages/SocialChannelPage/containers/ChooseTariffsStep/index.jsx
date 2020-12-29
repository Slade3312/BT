import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { useFormState } from 'react-final-form';
import { observer } from 'mobx-react';
import Heading from 'components/layouts/Heading';
import { FFRadioGroup } from 'components/fields';
import { useAudienceCount } from 'pages/NewCampaign/hooks/use-audience-count';
import commonStyles from 'styles/common.pcss';
import {
  RadioAdvertisingContentItem,
  RadioItemWithContent,
  RadioTariffsItem,
} from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/components';
import { FormFieldLabel } from 'components/forms';
import useSocialDatesValidators from 'pages/NewCampaign/ChannelsBriefsPages/hooks/useTargetInternetDatesValidators';
import NewLaunchDates from 'pages/NewCampaign/components/NewLaunchDates';
import { OverlayLoader, Tooltip } from 'components/common';
import { StoresContext } from 'store/mobx';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import styles from './styles.pcss';

function ChooseTariffsStep() {
  const dateValidators = useSocialDatesValidators();
  const { values } = useFormState();
  const { Social, Templates } = useContext(StoresContext);

  const formTemplate = Templates.getNewCampaignTemplate('BriefOrderTargetInternet')?.form_order || {};
  const briefTemplate = Templates.getNewCampaignTemplate('BriefOrderTargetInternet');

  const {
    autoStart,
    autoStartInstant,
    autoStartConcreteDate,
    date,
    chosenTariff,
  } = formTemplate;
  const { stepDateAndTariffTitle } = briefTemplate;
  const audienceCount = useAudienceCount();
  const autoStartOptions = useMemo(
    () => [
      { value: true, label: autoStartInstant.label, subLabel: autoStartInstant.subLabel, tooltip: autoStartInstant.tooltip },
      { value: false, label: autoStartConcreteDate.label, subLabel: autoStartConcreteDate.subLabel, tooltip: autoStartConcreteDate.tooltip },
    ],
    [],
  );

  return (
    <>
      <Heading className={commonStyles['marb-s']} level={3}>
        {stepDateAndTariffTitle}
      </Heading>

      <FormFieldLabel tooltip={autoStart?.tooltip} isBold>
        {autoStart?.label}
      </FormFieldLabel>

      <FFRadioGroup
        name={ADCREATINGFORM.AUTO_START}
        options={autoStartOptions}
        defaultValue={autoStartOptions[0].value}
        ItemComponent={(props) => (
          <RadioItemWithContent
            renderContent={RadioAdvertisingContentItem}
            {...props}
          />
        )}
        itemClassName={styles.radioItemAutoStart}
        keepErrorIndent={false}
        className={classNames(styles.radioGroup, commonStyles['marb-s'])}
      />

      {!values.auto_start === true && (
        <div
          className={classNames(commonStyles['marb-s'], styles.fieldHorizontal)}
        >
          <span className={styles.horizontalLabel}>
            {date?.label}
            {date.tooltip && <Tooltip>{date.tooltip}</Tooltip>}
          </span>

          <NewLaunchDates
            className={commonStyles['marb-xs']}
            {...dateValidators}
          />
        </div>
      )}

      <OverlayLoader isLoading={Social.isTariffsLoading}>
        <FormFieldLabel tooltip={chosenTariff.tooltip} isBold>{chosenTariff.label}</FormFieldLabel>
        <FFRadioGroup
          name={ADCREATINGFORM.CHOSEN_TARIFF}
          options={Social.getTariffsOptions}
          defaultValue={Social.getTariffsOptions[0]?.value}
          ItemComponent={(props) => {
            if (audienceCount < props.min_audience) return null; // eslint-disable-line
            return (
              <RadioItemWithContent className={styles.tariffsItem} renderContent={RadioTariffsItem} {...props} />
            );
          }
          }
          itemClassName={styles.radioItemTariff}
          className={classNames(styles.radioGroup, commonStyles['marb-l'])}
      />
      </OverlayLoader>
    </>
  );
}

export default observer(ChooseTariffsStep);
