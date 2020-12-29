import React, { useState, useContext } from 'react';
import { compose } from 'redux';
import { observer } from 'mobx-react';
import { runInAction, toJS } from 'mobx';
import PropTypes from 'prop-types';
import { uploadOrderFile } from 'requests/client/upload-order-file';
import * as Channel from 'store/NewCampaign/channels/selectors';
import { brandFileSizeBytes, brandFileSizeMegabytes } from 'pages/NewCampaign/constants';
import { removeOrderFile } from 'store/NewCampaign/storage/actions';
import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';
import withFinalField from 'enhancers/withFinalField';

import { FFMultiFileChannelInput } from '../../components';
import { StoresContext } from '../../../../store/mobx';
import { axiosAuthorizedRequest } from '../../../../requests/helpers';

const MAX_FILES_COUNT = 10;

const checkFilesListLengthExceeded = (currentList, newList) => {
  if (currentList.length + newList.length > MAX_FILES_COUNT) {
    return `Максимально можно загрузить до ${MAX_FILES_COUNT} файлов`;
  }
  return undefined;
};

const getValidateFileMessage = (file, newFilesCount) => {
  const startErrorMessage = newFilesCount > 1 ? 'Новые файлы не добавлены' : 'Новый файл не добавлен';

  if (file) {
    if (!/^.*\/(jpeg|jpg|png|pdf)$/i.test(file.type)) {
      return `${startErrorMessage}: допустимые типы файлов: .jpg, .pdf, .png`;
    }
    if (file.size > brandFileSizeBytes) {
      return `${startErrorMessage}: максимальный размер файла ${brandFileSizeMegabytes}мб`;
    }
  }
  return undefined;
};

const FFMultiFileChannelUploader = ({
  onChange,
  forwardedRef,
  onFileRemove,
  buttonNameWithFiles,
  buttonNameWithoutFiles,
  iconButton,
  error: errorFinalField,
  ...otherProps
}) => {
  const { NewCampaign } = useContext(StoresContext);
  const { files } = toJS(NewCampaign.currentCampaign?.currentOrder) || [];
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (newFiles) => {
    if (!newFiles.length) {
      return;
    }
    const newFilesArray = Array.from(newFiles);

    let errorMessage;
    const arr = [];

    errorMessage = checkFilesListLengthExceeded(files, newFilesArray);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    for (let i = 0; i < newFilesArray.length; i += 1) {
      errorMessage = getValidateFileMessage(newFilesArray[i], newFilesArray.length);
      if (errorMessage) {
        setError(errorMessage);
        return;
      }
    }

    setIsLoading(true);

    try {
      await Promise.all(newFilesArray.map(file =>
        uploadOrderFile(file)
          .then((resp) => {
            resp.name = file.name;
            arr.push(resp);

            onChange([...files, ...arr]);
            setError();
          })
          .catch((e) => {
            setError(e);
          })));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileRemove = async (id) => {
    const newFilesList = await axiosAuthorizedRequest({
      url: `/api/v1/client/order_files/${id}/`,
      method: 'DELETE',
      data: {
        order_id: NewCampaign.currentCampaign.currentOrder.id,
      },
    });
    runInAction(() => {
      NewCampaign.currentCampaign.currentOrder.files = NewCampaign.currentCampaign.currentOrder.files.filter(item => item.id !== id);
    });
    if (newFilesList) {
      onChange(newFilesList);
    }
  };

  return (
    <FFMultiFileChannelInput
      ref={forwardedRef}
      error={error || errorFinalField}
      isLoading={isLoading}
      onFileRemove={handleFileRemove}
      onInputChange={handleChange}
      files={files}
      buttonNameWithFiles={buttonNameWithFiles}
      buttonNameWithoutFiles={buttonNameWithoutFiles}
      iconButton={iconButton}
      {...otherProps}
    />
  );
};

FFMultiFileChannelUploader.propTypes = {
  onChange: PropTypes.func,
  forwardedRef: PropTypes.shape({ current: PropTypes.object }),
  error: PropTypes.string,
  buttonNameWithFiles: PropTypes.string,
  buttonNameWithoutFiles: PropTypes.string,
  iconButton: CustomPropTypes.templateField,
  files: PropTypes.array,
  removeFile: PropTypes.func,
  onPageEnter: PropTypes.func,
  onFileRemove: PropTypes.func,
  onInputChange: PropTypes.func,
  isLoading: PropTypes.bool,
};

const connector = Channel.connect(
  state => ({
  }),
  {
    onFileRemove: removeOrderFile,
  },
);

export default compose(
  withFinalField,
  connector,
  withForwardedRef,
)(observer(FFMultiFileChannelUploader));
