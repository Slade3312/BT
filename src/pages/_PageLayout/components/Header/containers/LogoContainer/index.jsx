import { connect } from 'react-redux';
import { getLogoHref } from 'store/common/header/selectors';
import { Logo } from 'components/common';

const mapStateToProps = state => ({
  href: getLogoHref(state),
});

export default connect(mapStateToProps)(Logo);
