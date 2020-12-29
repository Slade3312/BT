import debounce from 'debounce';

export const pushToGA = (data) => {
  window.dataLayer.push(data);
};

export const createDebouncedGA = time => debounce(data => pushToGA(data), time);
