const initialState = {
  pageLoaded: false,
  release: process.env.CURRENT_RELEASE || 'unknown',
};

export default function (state = initialState) {
  return state;
}
