import { connect } from 'react-redux';

import {
  getIsLoadingData,
  getOfferButtonText,
  getOfferDescription,
  getOfferLabelText,
  getOfferTitle,
} from 'store/common/userInfo/selector';
import { acceptOffer } from 'store/common/userInfo/actions';
import { PopupView } from './components';

const mapStateToProps = state => ({
  title: getOfferTitle(state),
  description: getOfferDescription(state),
  buttonText: getOfferButtonText(state),
  labelText: getOfferLabelText(state),
  isLoading: getIsLoadingData(state),
});

const mapDispatchToProps = {
  onSubmit: acceptOffer,
};

export default connect(mapStateToProps, mapDispatchToProps)(PopupView);
