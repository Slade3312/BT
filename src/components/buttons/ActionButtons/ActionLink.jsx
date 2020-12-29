import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Link } from '@reach/router';
import GlobalIcon from 'components/common/GlobalIcon';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ActionLink({
  href,
  align,
  isDisabled,
  children,
  className,
  iconSlug,
  isLight,
  isGrowing,
  backgroundColor,
  ...otherAttributes
}) {
  return (
    <Link
      to={href || ''}
      className={cx(
        'component', { growing: isGrowing, light: isLight, disabled: isDisabled, align },
        className,
      )}
      style={{ backgroundColor }}
      {...otherAttributes}
    >
      <span className={cx('text')}>{children}</span>
      {iconSlug && <GlobalIcon slug={iconSlug} className={cx('icon')} />}
    </Link>
  );
}

ActionLink.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  align: PropTypes.oneOf(['center']),
  iconSlug: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLight: PropTypes.bool,
  isGrowing: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
};
