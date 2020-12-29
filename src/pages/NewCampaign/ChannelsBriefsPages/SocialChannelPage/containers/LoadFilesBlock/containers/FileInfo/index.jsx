import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';
import Heading from 'components/layouts/Heading';
import { LightText, GlobalIcon } from 'components/common';
import { PureButton } from 'components/buttons';
import { myTargetLoadFileRequest, myTargetDeleteFileRequest } from 'requests/myTarget';
import Preloader from 'components/common/Preloader';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import { extractError } from 'utils/errors';
import FileIcon from 'components/common/FileIcon';

import styles from './styles.pcss';

function FileInfo({ files, fieldId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { Social } = useContext(StoresContext);

  const handleFileLoad = async (e) => {
    setError('');
    setIsLoading(true);

    try {
      const loadedFile = await myTargetLoadFileRequest({
        fileData: e.target.files[0],
        fieldId,
        orderId: Social.adStep.id,
      });

      Social.setCompanyInfoFile(loadedFile);
    } catch (newError) {
      setError(extractError(newError).description);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileRemove = async (id) => {
    setError('');
    setIsLoading(true);

    try {
      await myTargetDeleteFileRequest({
        fileId: id,
        fieldId,
        orderId: Social.adStep.id,
      });

      Social.removeCompanyInfoFile(id);
    } catch (newError) {
      setError(extractError(newError).description);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        classNames(styles.fileInfoContainer, files.some(item => item?.file_name?.length) && styles.haveFiles)
      }
    >
      {files.length !== 0 && files.some(item => item?.file_name?.length) ? (
          files.filter(filterItem => !!filterItem).map(fileItem => (
            <div className={styles.fileInfoRow}>
              <FileIcon
                isSvgIcon
                className={styles.fileIcon}
                extension={`${fileItem.file_extension}Round`}
                alt={`Скан ${fileItem?.file_name}`}
              />

              <Heading level={5}>{fileItem.file_name}</Heading>

              <LightText className={styles.fileSize}>
                ({`${fileItem.file_extension}, ${fileItem.file_size}`})
              </LightText>

              <PureButton className={styles.closeButton} onClick={() => handleFileRemove(fileItem.id)}>
                <GlobalIcon slug="crossThin" />
              </PureButton>
            </div>
          ))
        ) : (<>
          <label className={styles.loadFileButton}>
            {isLoading ? <Preloader className={styles.buttonPreloader} size={25} /> : 'Загрузить документ'}

            <input
              type="file"
              accept=".jpg,.png,.pdf"
              onChange={handleFileLoad}
              className={styles.loadFileInput}
              name={ADCREATINGFORM.INDUSTRY_DOCS}
            />
          </label>

          {error && <span className={styles.error}>{error}</span>}
        </>)
      }
    </div>
  );
}

FileInfo.propTypes = {
  files: PropTypes.array,
  fieldId: PropTypes.number,
};

export default observer(FileInfo);
