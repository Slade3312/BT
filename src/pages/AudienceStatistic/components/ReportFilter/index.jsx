import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { navigate } from '@reach/router';
import { FFSearchInput } from 'components/fields';
import { ActionButton } from 'components/buttons';
import { FIELD_CAMPAIGN_NAME } from 'store/shared/campaign-and-orders/constants';
import TileCol from '../ReportTile/components/TileCol';
import { ReportFilterForm } from './components';

function ReportFilter({ className }) {
  const handleNewCampaignClick = () => {
    navigate('/new-campaign/?channels=target-sms,target-internet,voice-target,internet,push&reset=true');
  };

  return (
    <ReportFilterForm className={className}>
      <TileCol type={TileCol.propConstants.types.search}>
        <FFSearchInput placeholder="Поиск по названию" name={FIELD_CAMPAIGN_NAME} maxLength={50} />
      </TileCol>

      <TileCol type={TileCol.propConstants.types.status}>
        Статус отчёта
      </TileCol>

      <TileCol type={TileCol.propConstants.types.date}/>

      <TileCol type={TileCol.propConstants.types.last}>
        <ActionButton
          onClick={handleNewCampaignClick}
          isGrowing
          iconSlug="arrowRightMinimal"
        >
          Создать новую кампанию
        </ActionButton>
      </TileCol>
    </ReportFilterForm>
  );
}

ReportFilter.propTypes = {
  className: PropTypes.string,
};

export default observer(ReportFilter);
