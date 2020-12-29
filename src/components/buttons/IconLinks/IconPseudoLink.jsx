import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import GlobalIcon from 'components/common/GlobalIcon';
import CustomPropTypes from 'utils/prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function IconPseudoLink({
  onClick,
  children,
  slug,
  icon,
  isDisabled,
  isCompact,
  className,
  isIconAfterText,
}) {
  return (
    <span onClick={onClick} className={cx('component', { compact: isCompact, disabled: isDisabled }, className)}>
      {!isIconAfterText && slug && (
        <GlobalIcon className={cx('icon')} icon={icon} slug={!icon && slug ? slug : undefined} />
      )}

      <span className={cx('text')}>{children}</span>

      {isIconAfterText && slug && (
        <GlobalIcon className={cx('icon afterText')} icon={icon} slug={!icon && slug ? slug : undefined} />
      )}
    </span>
  );
}

IconPseudoLink.propTypes = {
  slug: PropTypes.string,
  icon: CustomPropTypes.templateField,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  isCompact: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isIconAfterText: PropTypes.bool,
};

IconPseudoLink.defaultProps = {
  slug: 'paper',
};
