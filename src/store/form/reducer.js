// Reducer
import { filter } from 'utils/fn';
import { CHANGE_FORM_VALUES, DESTROY_FORM, INITIALIZE_FORM_VALUES, UPDATE_FORM_VALUES } from './constants';

const reducer = (state = {}, { type, payload }) => {
  switch (type) {
    case INITIALIZE_FORM_VALUES:
    case UPDATE_FORM_VALUES: {
      // for now we are receiving only values from payload, but we also could receive another meta
      const { formName, values } = payload;
      const formState = state[formName] || {};
      return {
        ...state,
        [formName]: { ...formState, values },
      };
    }
    case CHANGE_FORM_VALUES: {
      const { formName, values } = payload;
      const formState = state[formName] || {};
      const formValues = formState.values || {};
      return {
        ...state,
        [formName]: { ...formState, values: { ...formValues, ...values } },
      };
    }
    case DESTROY_FORM: {
      const { formName } = payload;
      return filter(state, (_, key) => key !== formName);
    }
    default:
      return state;
  }
};

export default reducer;
