import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from 'components/layouts';
import { PopupStateless } from 'components/common';
import LoaderIcon from './transparentLoader.svg';

import styles from './styles.pcss';

export default function BlackListLoaderModal({
  onClose,
  title,
  description,
}) {
  return (
    <PopupStateless opened onClose={onClose} hideCloseButton>
      <div className={styles.content}>
        <LoaderIcon className={styles.loaderIcon} />

        <Heading level={2}>{title}</Heading>

        <Heading level={4} className={styles.description}>{description}</Heading>
      </div>
    </PopupStateless>
  );
}

BlackListLoaderModal.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
};
