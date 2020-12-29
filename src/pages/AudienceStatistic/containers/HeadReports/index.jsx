import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';

import { HeadBlock } from '../../components';

function HeadReportsText({ className }) {
  const {
    Templates: {
      getAudienceStatisticTemplate,
    },
  } = useContext(StoresContext);
  const { title, description } = getAudienceStatisticTemplate('HeadReports');
  return <HeadBlock className={className} title={title} description={description} />;
}

HeadReportsText.propTypes = {
  className: PropTypes.string,
};

export default observer(HeadReportsText);
