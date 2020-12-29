import { pushToGA } from 'utils/ga-analytics/data-layer';

export const handlePromiseCreatorGA = (dataOnSuccess, dataOnError) => promise =>
  promise
    .then((res) => {
      pushToGA(dataOnSuccess);
      return res;
    })
    .catch((err) => {
      pushToGA(dataOnError);
      throw err;
    });
