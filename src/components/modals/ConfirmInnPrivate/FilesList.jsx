import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import GlobalIcon from 'components/common/GlobalIcon';
import bytesToSize from 'utils/bytesToSize';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const FilesList = ({ confirmation }) => {
  const deleteItem = (item) => {
    confirmation.files.remove(item);
  };
  return (
    <>
      {
        confirmation.files.map((item) => {
          return (
            <div
              key={item.preview}
              className={cx('previewItem')}
              onClick={() => deleteItem(item)}
            >
              <GlobalIcon slug="uploadedDocument" />
              <div className={styles.controlHolder}>
                <div className={styles.fileNameHolder}>
                  <span className={styles.fileName}>{item.file.name} {bytesToSize(item.file.size)}</span>
                </div>
                <GlobalIcon slug="crossThin" />
              </div>
            </div>
          );
        })
      }
    </>
  );
};

FilesList.propTypes = {
  confirmation: PropTypes.object,
};

export default observer(FilesList);
