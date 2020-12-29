import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useFormState } from 'react-final-form';
import { ARRAY_ERROR } from 'final-form';
import OnlineGeoAudienceChanged from 'pages/components/Notifications/components/OnlineGeoAudienceChanged/OnlineGeoAudienceChanged';
import FormFieldLabel from 'components/forms/FormFieldLabel';
import GeoTaxonsBlock from 'pages/NewCampaign/containers/GeoTaxonsBlock/index';
import { Switch } from 'components/fields';
import { withFinalField } from 'enhancers';
import { PortalWrapper } from 'components/helpers';
import { OverlayLoader } from 'components/common/Loaders';
import { GEO_POINTS, USE_ONLINE_GEO } from 'store/NewCampaign/channels/constants';
import { withError } from 'components/fields/TextInput/enhancers';
import { formatPrice } from 'utils/formatting';
import { Status } from 'components/common';
import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';

const FFSwitch = withFinalField(Switch);
const GeoPointsError = withError('span');

const OnlineGeo = ({ templates }) => {
  const { NewCampaign, WebsAndPhonesTaxons } = useContext(StoresContext);
  const [localError, setLocalError] = useState(false);
  const { submitFailed } = useFormState();
  const { use_online_geo, geo_points } = NewCampaign.currentCampaign?.currentOrder;
  const {
    errors: { [GEO_POINTS]: error },
  } = useFormState();

  useEffect(() => {
    NewCampaign.init();

    if (!WebsAndPhonesTaxons.hasSegmentsStrategy && use_online_geo === true) {
      NewCampaign.getOnlineGeoAudience(use_online_geo ? geo_points : []);
    }
  }, []);

  useEffect(() => {
    // super hack to handle error only after failed submit
    if (submitFailed) {
      setLocalError(true);
    }
  }, [submitFailed]);

  return (
    <div>
      <div className={styles.switchContainer}>
        <FormFieldLabel
          isBold
          tooltip={templates.tooltip}
          className={styles.label}
        >
          {templates.title}
        </FormFieldLabel>

        <FFSwitch
          isDisabled={
            WebsAndPhonesTaxons.hasSegmentsStrategy ||
            NewCampaign.isLoading ||
            NewCampaign.currentCampaign?.currentOrder?.external_operator === true
          }
          name={USE_ONLINE_GEO}
          keepErrorIndent={false}
          className={styles.switch}
        />
      </div>

      <GeoPointsError name={GEO_POINTS} keepErrorIndent={false} error={localError ? error?.[ARRAY_ERROR] : null} />

      {
        WebsAndPhonesTaxons.hasSegmentsStrategy &&
        <Status className={styles.status}>{templates.accessBlockedInfoText}</Status>
      }

      {
        NewCampaign.currentCampaign.currentOrder.external_operator &&
        <Status className={styles.status}>Для рассылки на других операторов онлайн гео недоступно</Status>
      }

      {use_online_geo && (
        <div className={styles.geoContainer}>
          <OverlayLoader isLoading={NewCampaign.isLoading}>
            <GeoTaxonsBlock
              className={styles.geo}
              name={GEO_POINTS}
              withoutGeoType
              mapAdvice={templates?.mapAdvice}
            />
          </OverlayLoader>
        </div>
      )}

      {NewCampaign.isNotificationActive ? (
        <PortalWrapper>
          <OnlineGeoAudienceChanged
            title={templates.notification.title}
            description={`${templates.notification.description} \n${formatPrice(NewCampaign.currentCampaign.audience)} человек`}
            onClick={NewCampaign.hideNotification}
          />
        </PortalWrapper>
      ) : null}
    </div>
  );
};

OnlineGeo.propTypes = {
  templates: PropTypes.shape({
    accessBlockedInfoText: PropTypes.string,
    title: PropTypes.string,
    tooltip: PropTypes.string,
    mapAdvice: PropTypes.string,
    notification: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  }),
};

export default observer(OnlineGeo);
