import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';

import { ExitButton, FileIcon } from 'components/common';
import styles from './styles.pcss';

const FilesPreview = () => {
  const { TinderChat } = useContext(StoresContext);

  const handleFileRemove = (fileObject) => {
    TinderChat.removePreviewFile(fileObject);
  };

  useEffect(() => {
    TinderChat.set('loadFilesError', '');
  }, [TinderChat.previewFilesToSend.length]);

  return (
    <ul className={styles.filesContainer}>
      {TinderChat.previewFilesToSend.map(file => (
        <li className={styles.filesListRow} key={file.id}>
          {file.url && (
            <img className={styles.filePreviewImg} alt="file from chat" src={file.url} />
          )}

          {file.extension && (
            <FileIcon
              className={styles.fileIcon}
              extension={file.extension}
              alt={`превью ${file?.name}`}
            />
          )}

          <span className={styles.fileText}>{file.name}</span>

          <ExitButton
            className={styles.removeIcon}
            onClick={() => handleFileRemove(file)}
          />
        </li>
      ))}
    </ul>
  );
};

export default observer(FilesPreview);
