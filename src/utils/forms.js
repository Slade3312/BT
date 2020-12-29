/**
 * given `json` data object, returns FormData object with data provided
 * to be used with `application/x-www-form-urlencoded` xhr requests
 */
export const toFormData = json => Object.keys(json).reduce(
  (formData, field) => {
    formData.set(field, json[field]);
    return formData;
  },
  new FormData(),
);


/**
 * given `json` data object, returns a string params in form of `key=value`, concatenated by &
 */
export const toUrlEncodedString = json => Object.keys(json)
  .map(field => (json[field] ? `${field}=${encodeURIComponent(json[field])}` : null))
  .join('&');


/**
 * Manually trigger form submit event similar to a default submit
 * it can be prevented via e.preventDefault() onSubmit
 * @param form {HTMLFormElement}
 */
export const triggerFormSubmit = (form) => {
  const handleFormSubmit = (e) => { if (!e.defaultPrevented) form.submit(); };
  form.addEventListener('submit', handleFormSubmit);

  const SubmitEvent = document.createEvent('Event');
  SubmitEvent.initEvent('submit', true, true);
  form.dispatchEvent(SubmitEvent);

  form.removeEventListener('submit', handleFormSubmit);
};
