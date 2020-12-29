import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from '@reach/router';
import { DeleteButton } from 'components/buttons';
import { RemoveCampaignModal } from 'components/modals';
import { StoresContext } from 'store/mobx';
import { pushToGA } from 'utils/ga-analytics/data-layer';

export default function DeleteButtonControls({ pollId }) {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const location = useLocation();

  const { Polls, Templates } = useContext(StoresContext);

  const { header, description, accept, decline } = Templates.getPollsTemplate('RemovePollModal');

  const handlePollDelete = async () => {
    await Polls.removePollById(pollId);
    setIsModalOpened(false);
  };

  const handleClickDeleteButton = () => {
    setIsModalOpened(true);
    pushToGA({
      event: 'event_b2b',
      eventCategory: 'linkClick',
      eventAction: 'Корзина',
      eventLabel: location.pathname,
    });
  };

  return (
    <>
      <DeleteButton onClick={handleClickDeleteButton} />
      {isModalOpened && (
      <RemoveCampaignModal
        title={header}
        description={description}
        onClose={() => setIsModalOpened(false)}
        buttonDecline={{
          text: decline,
        }}
        buttonConfirm={{
          text: accept,
          onClick: handlePollDelete,
        }}
      />
      )}
    </>
  );
}

DeleteButtonControls.propTypes = {
  pollId: PropTypes.number,
};
