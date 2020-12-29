import { composeAxiosPostRequest } from 'requests/helpers';

const CHECK_CTN = '/client/orders/check_ctn/';

export const checkNumber = async (phone) => {
  const response = await composeAxiosPostRequest({
    url: `/api/v1${CHECK_CTN}`,
    data: {
      ctn: phone,
    },
  });
  return response;
};
