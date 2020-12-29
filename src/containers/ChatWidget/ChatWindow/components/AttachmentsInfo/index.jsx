import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

export default function AttachmentsInfo({ files = [] }) {
  return <div className={styles.component}>Вложения ({files.length})</div>;
}

AttachmentsInfo.propTypes = {
  files: PropTypes.array,
};
