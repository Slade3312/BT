import React from 'react';
import { useNavigate } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { scrollSmoothTo } from 'utils/scroll';
import { isCampaignLaunched } from 'store/NewCampaign/controls/selectors';
import { getCampaignSuccessPopup } from 'store/common/templates/newCampaign/selectors';
import { resetCampaignCreationProcess } from 'store/NewCampaign/steps/actions/update';
import { getHolidays } from 'store/settings/selectors';
import { MY_CAMPAIGNS_URL } from 'pages/constants';
import { getConstantsVariables } from 'store/common/commonConstants/selector';
import NotificationPopup from 'pages/NewCampaign/components/NotificationPopup';
import { getIsWorkTime } from 'utils/date';

export default function CampaignSuccessPopup() {
  const dispatch = useDispatch();
  const { title, description, weekendDescription, buttonText } = useSelector(getCampaignSuccessPopup);

  const isOpen = useSelector(isCampaignLaunched);
  const navigate = useNavigate();

  const holidays = useSelector(getHolidays);
  const { START_TIME } = useSelector(getConstantsVariables);
  const isWorkTime = getIsWorkTime(holidays, START_TIME);

  const handleClick = async () => {
    await dispatch(resetCampaignCreationProcess());

    // hash used to prevent show draft notification
    await navigate(`${MY_CAMPAIGNS_URL}#success-start`);
    scrollSmoothTo(0);
  };

  return (
    <NotificationPopup
      onButtonClick={handleClick}
      onClose={handleClick}
      title={title}
      description={isWorkTime ? description : weekendDescription}
      buttonText={buttonText}
      isOpen={isOpen}
    />
  );
}
