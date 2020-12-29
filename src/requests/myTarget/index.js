import {
  composeAxiosMutationFileDataRequest,
  composeAxiosDeleteRequest,
  axiosAuthorizedRequest,
} from 'requests/helpers';

const INDUSTRIES_URL = '/api/v1/my_target/industries/';

export const requestIndustries = () => axiosAuthorizedRequest({ url: INDUSTRIES_URL });

export const myTargetLoadFileRequest = ({ fileData, orderId, fieldId }) =>
  composeAxiosMutationFileDataRequest({
    url: '/api/v1/my_target/industries_docs_files/',
    method: 'POST',
  })({ file: fileData, order_id: orderId, industry_docs: fieldId });

export const myTargetDeleteFileRequest = ({ fileId, orderId, fieldId }) =>
  composeAxiosDeleteRequest({
    url: `/api/v1/my_target/industries_docs_files/${fileId}`,
  })({ order_id: orderId, industry_docs: fieldId });
