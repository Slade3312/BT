import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import classNames from 'classnames/bind';

import { ORDER_TOOLS_FIELD } from 'store/NewCampaign/channels/constants';
import { getInternetBriefFormOrder } from 'store/common/templates/newCampaign/briefs-selectors';

import Tooltip from 'components/common/Tooltip';
import { FFInstruments } from '../../containers';
import FieldLabel from '../FieldLabel';
import ToolsDetailsModal from '../ToolsDetailsModal';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

const ToolsField = () => {
  const { tools } = useSelector(getInternetBriefFormOrder);
  const [isPopupOpened, setIsPopupOpened] = useState(false);

  const handlePopupOpen = (event) => {
    event.preventDefault();
    setIsPopupOpened(true);
  };

  return (
    <div className={cx('fieldRow')}>
      <FieldLabel
        text={tools.label}
        renderTooltip={() => (
          <Tooltip>
            {tools.tooltip}

            <br />
            <br />

            <a href="/" onClick={handlePopupOpen}>
              Узнать об инструментах подробнее
            </a>
          </Tooltip>
        )}
      />

      <FFInstruments name={ORDER_TOOLS_FIELD} />

      <ToolsDetailsModal
        isOpened={isPopupOpened}
        setIsPopupOpened={setIsPopupOpened}
      />
    </div>
  );
};

export default ToolsField;
