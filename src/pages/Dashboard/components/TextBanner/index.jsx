import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { GlobalIcon } from 'components/common';
import { ActionLink } from 'components/buttons';

import styles from './styles.pcss';

function TextBanner({
  title,
  description,
  buttonText,
  href,
  iconSlug,
  content,
  backgroundColor,
}) {
  return (
    <div className={styles.container} style={{ backgroundColor }}>
      <GlobalIcon slug={iconSlug} className={styles.icon} />

      <div className={styles.contentWrapper}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{title}</h3>

          {description && <p className={styles.description}>{description}</p>}
        </div>

        <p className={styles.content}>{content}</p>
      </div>

      <ActionLink isLight href={href} className={styles.button}>{buttonText}</ActionLink>
    </div>
  );
}

TextBanner.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  content: PropTypes.string,
  iconSlug: PropTypes.string,
  href: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default observer(TextBanner);
