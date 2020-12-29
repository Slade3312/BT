import { connect } from 'react-redux';

import {
  getFooterLinksGroups,
  getFooterSocials,
  getFooterDescription,
} from 'store/common/templates/common/selectors';

import Footer from 'components/layouts/Footer';

const mapStateToProps = state => ({
  linksGroups: getFooterLinksGroups(state),
  socials: getFooterSocials(state),
  description: getFooterDescription(state),
});

export default connect(mapStateToProps)(Footer);

