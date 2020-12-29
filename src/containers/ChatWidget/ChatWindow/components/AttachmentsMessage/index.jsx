import React from 'react';
import PropTypes from 'prop-types';
import { formatPureFileName } from 'utils/formatting';
import { getFileExtension } from 'utils/fn';
import { isImage } from 'utils/is-image';
import FileIcon from 'components/common/FileIcon';
import styles from './styles.pcss';

const MAX_IMAGES_PER_LINE_1 = 3;
const MAX_IMAGES_PER_LINE_2 = 2;

const BIG_ICONS_PER_LINE_LIMIT = 3;

// TODO make this variable dynamic
/* to correct know scrollHeight until all images haven't been loaded */
const CHAT_WIDTH = 328;

/* show all images in one group and other attachments in another group */
export default function AttachmentsMessage({ files = [] }) {
  const preparedFilesList = files.map(elem => typeof elem !== 'object' ? elem : decodeURI(elem.relative_path));

  const onlyDocumentsList = preparedFilesList.filter(path => !isImage(path));
  const onlyImagesList = preparedFilesList.filter(path => isImage(path));

  const countImages = onlyImagesList.length;

  const currentMaxPerLine =
    countImages <= BIG_ICONS_PER_LINE_LIMIT
      ? MAX_IMAGES_PER_LINE_2
      : MAX_IMAGES_PER_LINE_1;

  const imagesCountOnLastRow = countImages % currentMaxPerLine;
  const imagesWithNormalWidth = countImages - imagesCountOnLastRow;

  /* show MAX_IMAGES_PER_LINE_2 or MAX_IMAGES_PER_LINE_1 per line if images length more than BIG_ICONS_PER_LINE_LIMIT
  *  show max stretch for images on last line */
  const getCurrentImageDimensions = (index) => {
    if (index > imagesWithNormalWidth - 1) {
      return { width: `${CHAT_WIDTH / imagesCountOnLastRow}px`, height: `${CHAT_WIDTH / imagesCountOnLastRow}px` };
    }
    return { width: `${CHAT_WIDTH / currentMaxPerLine}px`, height: `${CHAT_WIDTH / currentMaxPerLine}px` };
  };

  return (
    <>
      {/* other attachments */}
      <div className={styles.filesAttachmentsList}>
        {onlyDocumentsList.map(path => {
          const title = formatPureFileName(path);
          const fileExtension = getFileExtension(path);

          return (
            <a
              key={path}
              rel="noreferrer"
              target="_blank"
              href={path}
              className={styles.fileAttachment}
            >
              <div className={styles.iconWrapper}>
                <FileIcon className={styles.fileIcon} extension={fileExtension} alt="Вложение - документ" />
              </div>
              <div className={styles.title}>{`${title}.${fileExtension}`}</div>
            </a>
          );
        })}
      </div>


      {/* images */}
      <div className={styles.imagesAttachmentsList}>
        {onlyImagesList.map((path, index) => {
          return (
            <a
              key={path}
              className={styles.imageAttachment}
              style={getCurrentImageDimensions(index)}
              rel="noreferrer"
              target="_blank"
              href={path}
            >
              <div
                style={{ backgroundImage: `url(${path})` }}
                className={styles.image}
                />
            </a>
          );
        })}
      </div>
    </>
  );
}

AttachmentsMessage.propTypes = {
  files: PropTypes.array,
};
