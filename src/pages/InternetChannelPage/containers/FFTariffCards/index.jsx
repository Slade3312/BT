import React, { useState, useMemo, useCallback, useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';
import { StoresContext } from 'store/mobx';
import { withFinalField } from 'enhancers';
import { CHANNEL_STUB_INTERNET } from 'constants/index';

import QuestionModalContainer from '../QuestionModalContainer';

import { TariffCard } from '../../components/TariffCards';
import style from './styles.pcss';

const mapIconsByTariffs = (iconsById, tariffs) => {
  const result = {};
  (tariffs || []).forEach((item) => {
    const toolIds = {};
    item?.tools?.forEach((tool) => {
      if (toolIds[`type_id_${tool.type_id}`]) {
        toolIds[`type_id_${tool.type_id}`].push(iconsById[tool.id]);
      } else {
        toolIds[`type_id_${tool.type_id}`] = [iconsById[tool.id]];
      }
    });
    result[item.id] = toolIds;
  });
  return result;
};

const TariffCards = ({ onChange, value, name, className }) => {
  const { Templates, NewCampaign } = useContext(StoresContext);
  const questionModalTemplate = Templates.getNewCampaignTemplate('BriefOrderInternet').QuestionModal;
  const {
    values: { tariffs },
  } = useFormState();

  const iconsById = {};
  NewCampaign.tools.forEach(tool => {
    iconsById[tool.id] = tool.icon;
    return iconsById;
  });

  const icons = useMemo(() => mapIconsByTariffs(iconsById, tariffs), [iconsById, tariffs]);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const handleQuestionButtonClick = useCallback(() => setIsQuestionModalOpen(true), []);
  const handleModalClose = useCallback(() => setIsQuestionModalOpen(false), []);

  return (
    <div className={classNames(style.component, className)} name={name}>
      {(tariffs || []).map(item => (
        <TariffCard
          {...item}
          key={item.id}
          icons={icons[item.id]}
          onChange={onChange}
          onQuestionButtonClick={handleQuestionButtonClick}
          selected={value === item.id}
        />
      ))}

      {isQuestionModalOpen && (
        <QuestionModalContainer
          template={questionModalTemplate}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

TariffCards.propTypes = {
  onChange: PropTypes.func,
  questionModalTemplate: PropTypes.shape({}),
  value: PropTypes.number,
  name: PropTypes.string,
  className: PropTypes.string,
};

export default observer(withFinalField(TariffCards));
