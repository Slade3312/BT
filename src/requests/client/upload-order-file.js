import { ORDER_FILES_URL } from 'requests/client/constants';
import { composeAxiosMutationFileDataRequest, composeAxiosDeleteRequest } from 'requests/helpers';
import { FILE_TYPES } from 'pages/constants';

export const uploadOrderFile = fileBlob =>
  composeAxiosMutationFileDataRequest({ url: ORDER_FILES_URL, method: 'POST' })({
    file: fileBlob,
    type: FILE_TYPES.BRAND_FILE,
  });

export const deleteOrderFile = ({ fileID, orderId }) =>
  composeAxiosDeleteRequest({
    url: `${ORDER_FILES_URL}${fileID}/`,
  })({ order_id: orderId });

export const uploadFocusFile = fileBlob =>
  composeAxiosMutationFileDataRequest({ url: ORDER_FILES_URL, method: 'POST' })({
    file: fileBlob,
    type: FILE_TYPES.FOCUS,
  });
