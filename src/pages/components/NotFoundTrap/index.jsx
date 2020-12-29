import { connect } from 'react-redux';
import { withMountListening } from 'enhancers';
import { compose } from 'utils/fn';
import { setGlobalErrorData } from 'store/common/errorInfo/actions';


const mapDispatchToProps = dispatch => ({
  onMount: () => dispatch(setGlobalErrorData({ statusCode: 404 })),
});

export default compose(
  connect(null, mapDispatchToProps),
  withMountListening,
)(() => null);
