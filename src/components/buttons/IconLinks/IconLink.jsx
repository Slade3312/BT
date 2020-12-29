import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import GlobalIcon from 'components/common/GlobalIcon';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function IconLink({
  children,
  href,
  slug,
  isDisabled,
  className,
  isCompact,
  isIconAfterText,
  isIconBeforeText,
  ...nativeAttrs
}) {
  return (
    <a
      href={href}
      className={cx('component', { compact: isCompact, disabled: isDisabled }, className)}
      {...nativeAttrs}
    >
      {isIconBeforeText && slug && <GlobalIcon className={cx('icon')} slug={slug} />}

      <span className={cx('text')}>{children}</span>

      {isIconAfterText && slug && <GlobalIcon className={cx('icon', 'afterText')} slug={slug} />}
    </a>
  );
}

IconLink.propTypes = {
  href: PropTypes.string,
  slug: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  children: PropTypes.node,
  onClick: PropTypes.func,
  isCompact: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isIconAfterText: PropTypes.bool,
  isIconBeforeText: PropTypes.bool,
};

IconLink.defaultProps = {
  slug: 'paper',
  isIconBeforeText: true,
};
