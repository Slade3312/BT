import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { IconLink } from 'components/buttons';
import { stopPropagation } from 'utils/events';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const TariffsLink = ({ href, children }) => (
  <div className={cx('container')}>
    <IconLink
      target="_blank"
      href={href}
      onClick={stopPropagation}
      isIconBeforeText={false}
      isCompact
      className={[cx('link'), 'hideVisitedColor']}
    >
      {children}
    </IconLink>
  </div>
);

TariffsLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};

export default TariffsLink;
