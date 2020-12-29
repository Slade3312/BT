import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import GlobalIcon from 'components/common/GlobalIcon';

import styles from './styles.pcss';


export default function TariffInfoLink({ href, afterLinkText, iconSlug, className }) {
  return (
    <div className={classNames(styles.tariffsLinkHolder, className)}>
      <GlobalIcon slug={iconSlug} />

      <div className={styles.tariffsLink}>
        <a rel="noreferrer" href={href} target="_blank">
          Тарифный план
        </a>
        {afterLinkText}
      </div>
    </div>
  );
}

TariffInfoLink.propTypes = {
  href: PropTypes.string,
  afterLinkText: PropTypes.string,
  className: PropTypes.string,
  iconSlug: PropTypes.string,
};
