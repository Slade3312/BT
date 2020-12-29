import { connect } from 'react-redux';
import { popPushAudienceChangedNotification } from 'store/notifications/actions';
import {
  getTitlePushAudienceNormalized,
  getPushAudienceDescriptionNormalized,
} from 'store/common/templates/notifications/selectors';
import { PushAudienceChanged } from '../../components';


export default connect(state => ({
  title: getTitlePushAudienceNormalized(state),
  description: getPushAudienceDescriptionNormalized(state),
}), {
  onClick: popPushAudienceChangedNotification,
})(PushAudienceChanged);
