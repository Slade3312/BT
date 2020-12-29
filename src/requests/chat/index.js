import { axiosAuthorizedRequest, composeAxiosMutationFileDataRequest } from 'requests/helpers';
import { FILE_TYPES } from 'pages/constants';

export const chatMessagesRequest = (url) =>
  axiosAuthorizedRequest({ url: url || '/api/v1/client/chat_messages/' });

export const uploadFileToChatRequest = (fileBlob) =>
  composeAxiosMutationFileDataRequest({ url: 'api/v1/client/chat_messages/upload_file/', method: 'POST' })({
    file: fileBlob,
    type: FILE_TYPES.FOCUS,
  });
