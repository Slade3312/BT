import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import classNames from 'classnames/bind';
import { pushTopNavClickToGA } from 'utils/ga-analytics/utils';
import { getHelpLinkHref, getHelpLinkTitle } from 'store/common/header/selectors';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function HelpLink({ href, title }) {
  const isActive = ({ isCurrent }) => (isCurrent ? { className: cx('component', 'active') } : null);
  const handleClick = () => {
    pushTopNavClickToGA({ slugTitle: title });
  };

  return (
    <Link onClick={handleClick} getProps={isActive} to={href || ''} className={cx('component')}>
      {title}
    </Link>
  );
}

HelpLink.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
};

const mapStateToProps = state => ({
  href: getHelpLinkHref(state),
  title: getHelpLinkTitle(state),
});

export default connect(mapStateToProps)(HelpLink);
