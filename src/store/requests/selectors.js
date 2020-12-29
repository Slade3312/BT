
const __getRequestsList = state => state.requests;

const getRequestDataByKey = state => key => __getRequestsList(state)[key] || {};
export const getRequestStatus = state => requestKey => getRequestDataByKey(state)(requestKey).status;
