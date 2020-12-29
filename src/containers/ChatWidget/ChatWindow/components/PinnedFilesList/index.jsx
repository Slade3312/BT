import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import FileIcon from 'components/common/FileIcon';
import { getFileExtension } from 'utils/fn';
import ExitButton from 'components/common/ExitButton';
import { isImage } from 'utils/is-image';
import { BeautyScrollbar } from 'components/common';
import styles from './styles.pcss';

function PinnedFilesList({ onFileRemove }) {
  const { Chat } = useContext(StoresContext);

  const handleFileRemove = (file) => {
    onFileRemove(file);
    Chat.removePinnedFile(file);
  };

  return (
    <BeautyScrollbar className={styles.component}>
      {Chat.pinnedFiles.map((file) => {
        const { url, name, id } = file;

        const isImageFile = isImage(name);
        const fileExt = getFileExtension(name);

        return (
          <div key={id} className={styles.item}>
            <div className={styles.iconWrapper}>
              {isImageFile ? (
                <img className={styles.fileIcon} src={url} alt="Прикреплённое вложение - картинка" />
              ) : (
                <FileIcon className={styles.fileIcon} extension={fileExt} />
              )}
            </div>

            <div className={styles.fileName}>{name}</div>

            <ExitButton
              className={styles.removeIcon}
              onClick={() => handleFileRemove(file)}
            />
          </div>
        );
      })}
    </BeautyScrollbar>
  );
}

PinnedFilesList.propTypes = {
  onFileRemove: PropTypes.func,
};

export default observer(PinnedFilesList);
