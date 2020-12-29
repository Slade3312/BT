import update from 'immutability-helper';

update.extend('$updateOrAppendById', (value, arr) => update(
  arr,
  Object.keys(value).reduce((result, itemId) => {
    const index = arr.findIndex(({ id }) => id.toString() === itemId);
    if (index !== -1) {
      result[index] = value[itemId];
    } else {
      result[arr.length] = value[itemId];
    }
    return result;
  }, {}),
));
