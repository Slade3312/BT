import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AttachmentsInfo from 'containers/ChatWidget/ChatWindow/components/AttachmentsInfo';
import styles from './styles.pcss';

export default function MessageContainer({ text, files, isPrimary }) {
  return (
    <div className={classNames(styles.component, isPrimary && styles.primary)}>
      {text &&
      <div className={styles.textWrapper}>
        <p className={styles.text}>{text}</p>
      </div>
    }
      {files.length > 0 && <AttachmentsInfo files={files} />}
    </div>
  );
}

MessageContainer.propTypes = {
  text: PropTypes.string,
  files: PropTypes.array,
  isPrimary: PropTypes.bool,
};
