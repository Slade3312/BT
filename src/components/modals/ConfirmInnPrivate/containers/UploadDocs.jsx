import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Templates from 'store/mobx/Templates';
import commonStyles from 'styles/common.pcss';
import { UploadPrivate } from 'components/common';

import styles from '../styles.pcss';
import FilesList from '../FilesList';

const cx = classNames.bind({ ...commonStyles, ...styles });

const UploadDocs = React.forwardRef((props, ref) => {
  const { confirmation } = props;
  return (
    <>
      <div className={cx('inputRow', 'uploadPrivate')}>
        <div className={styles.labelHolder}>
          <label>{Templates.getConfirmInnPrivateTemplate('pasportScan')}</label>
        </div>
        <UploadPrivate
          ref={ref}
          errorFilesText={confirmation.errorFilesText}
          onFilesUpload={confirmation.uploadFiles}
        />
      </div>

      {
        confirmation.files.length &&
        <div className={cx('previewContainer')}>
          <FilesList
            accept=".png, .jpg, .jpeg"
            confirmation={confirmation}
          />
        </div> || null
      }
    </>
  );
});

UploadDocs.propTypes = {
  confirmation: PropTypes.object,
};

export default observer(UploadDocs);
