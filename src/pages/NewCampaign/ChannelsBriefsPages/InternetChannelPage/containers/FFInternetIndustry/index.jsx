import { connect } from 'react-redux';
import { FFSelect } from 'components/fields';
import { getDictionariesIndustriesOptions } from 'store/NewCampaign/dictionaries/selectors';

export default connect(state => ({
  options: getDictionariesIndustriesOptions(state),
}))(FFSelect);
