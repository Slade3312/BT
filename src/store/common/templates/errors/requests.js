import { requestTemplate } from 'requests/templates/request-template';
import { setTemplate } from 'store/common/templates/actions';
import { composeErrorCatchingRequest } from 'requests/helpers';

export default async function getErrorTemplates(dispatch) {
  const errors = await composeErrorCatchingRequest(requestTemplate)('errors');
  dispatch(setTemplate('errors', errors));
}
