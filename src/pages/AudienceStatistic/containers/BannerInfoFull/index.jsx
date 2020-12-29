import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';

import { CompactBanner } from '../../components';

const BannerInfoFull = ({ className }) => {
  const {
    Templates: {
      getAudienceStatisticTemplate,
    },
  } = useContext(StoresContext);

  const banner = getAudienceStatisticTemplate('CompactBannerInfo');

  return (
    <CompactBanner
      title={banner?.full?.title}
      description={banner?.full?.description}
      buttonText={banner?.full?.buttonText}
      imageURL={banner?.full?.imageURL}
      className={className}
    />
  );
};

BannerInfoFull.propTypes = {
  className: PropTypes.string,
};

export default observer(BannerInfoFull);
