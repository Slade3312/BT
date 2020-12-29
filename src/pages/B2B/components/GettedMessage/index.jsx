import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FileIcon } from 'components/common';

import { getLinksFromText } from '../../utils';
import styles from './styles.pcss';


function GettedMessage({ text, time, isSimple, imageUrl, fileUrl, fileExtension }) {
  return (
    <li className={classNames(styles.gettedMessage, isSimple && styles.simple)}>
      {imageUrl ? (
        <a href={imageUrl} target="blank">
          <img className={styles.messageImage} src={imageUrl} alt="file message" />
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
            <React.Fragment>
              <p className={styles.messageText}>
                {getLinksFromText(text)}
              </p>

              {time && <span className={styles.time}>{time}</span>}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </li>
  );
}

GettedMessage.propTypes = {
  text: PropTypes.string,
  time: PropTypes.string,
  imageUrl: PropTypes.string,
  fileUrl: PropTypes.string,
  fileExtension: PropTypes.string,
  isSimple: PropTypes.bool,
};

export default GettedMessage;
