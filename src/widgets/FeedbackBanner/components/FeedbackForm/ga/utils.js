import { handlePromiseCreatorGA } from 'store/requests/ga/index';

export const BLOCK_NAME = 'Или просто посоветуйтесь со специалистом Билайн';

const handleSaveQuestionGA = handlePromiseCreatorGA(
  {
    event: 'event_b2b_question',
    action: 'send_question_success',
    blockName: BLOCK_NAME,
  },
  {
    event: 'event_b2b_question',
    action: 'send_question_error',
    blockName: BLOCK_NAME,
  },
);

export const handleGASaveQuestionCreator = request => data => handleSaveQuestionGA(request(data));
