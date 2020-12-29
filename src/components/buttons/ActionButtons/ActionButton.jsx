import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import GlobalIcon from 'components/common/GlobalIcon';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ActionButton({
  isDisabled,
  children,
  className,
  iconSlug,
  isLight,
  isGrowing,
  buttonRef,
  backgroundColor,
  iconSlugBefore,
  ...otherAttributes
}) {
  return (
    <button
      className={cx(
        'component', { growing: isGrowing, light: isLight, disabled: isDisabled },
        className,
      )}
      {...otherAttributes}
      ref={buttonRef}
      style={{ backgroundColor }}
    >
      {iconSlugBefore && <GlobalIcon slug={iconSlugBefore} className={cx('iconBefore')} />}

      <span className={cx('text')}>{children}</span>

      {iconSlug && <GlobalIcon slug={iconSlug} className={cx('icon')} />}
    </button>
  );
}

ActionButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  align: PropTypes.oneOf(['center']),
  iconSlug: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLight: PropTypes.bool,
  isGrowing: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  buttonRef: PropTypes.shape({ current: PropTypes.object }),
  backgroundColor: PropTypes.string,
  iconSlugBefore: PropTypes.any,
};

ActionButton.defaultProps = {
  type: 'button',
};
