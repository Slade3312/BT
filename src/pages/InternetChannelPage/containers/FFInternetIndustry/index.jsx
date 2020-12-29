import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { FFSelect } from 'components/fields';
import { ORDER_INDUSTRY_FIELD } from 'store/NewCampaign/channels/constants';

const FFinternetIndustry = ({ className }) => {
  const { Common } = useContext(StoresContext);
  const options = Common.internetChannelIndustries.map(item => ({
    label: item.name,
    name: item.name,
    value: item.id,
  }));
  return <FFSelect options={options} name={ORDER_INDUSTRY_FIELD} className={className} />;
};

FFinternetIndustry.propTypes = {
  className: PropTypes.string,
};

export default observer(FFinternetIndustry);
