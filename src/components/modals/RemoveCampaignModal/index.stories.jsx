import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Description } from 'components/storybook';
import { RemoveCampaignModal } from './index';

export default {
  title: 'RemoveCampaign Modals',
  decorators: [withKnobs],
};

const onDeleteAction = action('onDelete');
const onCloseAction = action('onClose');

export const RemoveCampaign = () => (
  <React.Fragment>
    <Description>RemoveCampaign Modal: </Description>

    <RemoveCampaignModal
      title={text('title', 'Удалить отчёт?')}
      description={text('description', `Отчёт перестанет быть доступен, ${'\n'} как только вы нажмёте «Удалить».`)}
      onClose={onCloseAction}
      buttonDecline={{
        text: text('buttonDeclineText', 'Отменить'),
      }}
      buttonConfirm={{
        text: text('buttonDeleteText', 'Удалить'),
        onClick: onDeleteAction,
      }}
    />
  </React.Fragment>
);

