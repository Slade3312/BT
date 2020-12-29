import { connect } from 'react-redux';
import { popCampaignSavedDraftNotification } from 'store/notifications/actions';
import { CampaignSavedDraft } from '../../components';

export default connect(null, {
  onClick: popCampaignSavedDraftNotification,
})(CampaignSavedDraft);
