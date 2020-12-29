import React, { Component } from 'react';
import classNames from 'classnames/bind';

import PropTypes from 'prop-types';
import { GlobalIcon } from '../../common';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

// TODO: LEGACY
export default class LinkLegacy extends Component {
  onClick = (event) => {
    if (event.metaKey || event.shiftKey || event.altKey || event.ctrlKey) {
      return;
    }
    this.props.onClick(event);
  };

  render() {
    const {
      children,
      href,
      target,
      onClick,
      notPseudo,
      className,
    } = this.props;

    const Tag = href ? 'a' : 'span';

    const elClassName = cx(className, {
      link: true,
      pseudoLink: !href && !notPseudo,
    });

    const icon = href && target === '_blank' ? (
      <GlobalIcon slug="externalLink" className={cx('icon')} />
    ) : null;

    return (
      <Tag
        className={elClassName}
        data-component="Link"
        href={href}
        target={href ? target : null}
        onClick={onClick ? this.onClick : undefined}
      >
        <span className={cx('text')}>{children}</span>
        {icon}
      </Tag>
    );
  }
}

LinkLegacy.propTypes = {
  children: PropTypes.any,
  href: PropTypes.string,
  target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),
  onClick: PropTypes.func,
  notPseudo: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};
