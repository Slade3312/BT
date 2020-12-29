import React from 'react';
import { useObserver } from 'mobx-react';
import PropTypes from 'prop-types';
import GlobalIcon from 'components/common/GlobalIcon';
import styles from './styles.pcss';

const UploadPrivate = React.forwardRef((
  props,
  ref,
) => {
  const {
    onFilesUpload,
    accept = '.png, .jpg, .jpeg, .pdf',
    errorFilesText,
  } = props;
  const uploadFiles = (e) => {
    onFilesUpload(e.target.files);
  };
  return useObserver(() => (
    <div>
      <div className={styles.inputHolder}>
        <div className={styles.row}>
          <GlobalIcon slug="userYellow" />
          <div className={styles.title} onClick={() => ref.current.click()}>Загрузите файл</div>
          <div className={styles.description}>2-3 страница + последняя прописка</div>
          <input type="file" accept={accept} className={styles.inputFile} ref={ref} onChange={uploadFiles}/>
        </div>
        { errorFilesText && <div className={styles.error}>{errorFilesText}</div> || null }
      </div>
    </div>
  ));
});

UploadPrivate.propTypes = {
  onFilesUpload: PropTypes.func,
  accept: PropTypes.string,
  errorFilesText: PropTypes.any,
};

export default UploadPrivate;
