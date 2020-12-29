import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FileIcon } from 'components/common';

import { getLinksFromText } from '../../utils';

import styles from './styles.pcss';

export default function SendedMessage({ text, time, isSimple, imageUrl, fileUrl, fileExtension }) {
  return (
    <li className={classNames(styles.sendedMessage, isSimple && styles.simple)}>
      {imageUrl ? (
        <a href={imageUrl} target="blank">
          <img src={imageUrl} alt="file message" className={styles.messageImage} />
        </a>
      ) : (
        <React.Fragment>
          {fileUrl ? (
            <>
              <span className={styles.fileMessageTitle}>File: {'  '}</span>
              <a href={fileUrl} className={styles.fileText} target="blank">
                <FileIcon
                  className={styles.fileIcon}
                  extension={fileExtension}
                  alt={`превью ${fileUrl}`}
                />
                {fileUrl}
              </a>
            </>
          ) : (
            <>
              <p className={styles.messageText}>
                {getLinksFromText(text)}
              </p>

              {time && <span className={styles.time}>{time}</span>}
            </>
          )}
        </React.Fragment>
      )}
    </li>
  );
}

SendedMessage.propTypes = {
  text: PropTypes.string,
  time: PropTypes.string,
  imageUrl: PropTypes.string,
  fileUrl: PropTypes.string,
  fileExtension: PropTypes.string,
  isSimple: PropTypes.bool,
};
