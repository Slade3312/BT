import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { PureButton } from 'components/buttons';
import CustomPropTypes from 'utils/prop-types';
import { GlobalIcon } from 'components/common';

import { withForwardedRef } from 'enhancers';


import withError from 'components/fields/TextInput/enhancers/withError';

import FilePreloader from '../FilePreloader';
import MultiFileChannelInput from '../MultiFileChannelInput';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const FFMultiFileChannelInput = ({
  onInputChange,
  forwardedRef,
  files,
  orderId,
  onFileRemove,
  isLoading,
  error: errorFinalField,
  accept,
  buttonNameWithFiles,
  buttonNameWithoutFiles,
  iconButton,
  iconFile,
  ...otherProps
}) => (
  <div className={cx('component')}>
    <div className={cx('column-control')}>
      <MultiFileChannelInput
        {...otherProps}
        iconButton={iconButton}
        buttonNameWithFiles={buttonNameWithFiles}
        buttonNameWithoutFiles={buttonNameWithoutFiles}
        files={files}
        accept={accept}
        onChange={onInputChange}
        ref={forwardedRef}
      />
    </div>

    {files.length ? (
      <>
        <div className={cx('column-files')}>
          {files.map(item => (
            <div key={item.id} className={cx('fileContainer')}>
              <a href={item.file} rel="noopener noreferrer" target="_blank" className={cx('fileName')}>
                <GlobalIcon className={cx('buttonIcon')} icon={iconFile} />

                <span className={cx('text')}>{item.name}</span>
              </a>

              <PureButton className={cx('removeButton')} onClick={() => onFileRemove(item.id)}>
                <GlobalIcon slug="cross" className={cx('crossIcon')} />
              </PureButton>
            </div>
          ))}
        </div>

        {isLoading && <FilePreloader />}
      </>
    ) : null}
  </div>
);

FFMultiFileChannelInput.propTypes = {
  orderId: PropTypes.number,
  onChange: PropTypes.func,
  forwardedRef: PropTypes.shape({ current: PropTypes.object }),
  error: PropTypes.string,
  files: PropTypes.array,
  buttonNameWithoutFiles: PropTypes.string,
  buttonNameWithFiles: PropTypes.string,
  iconButton: CustomPropTypes.templateField,
  iconFile: CustomPropTypes.templateField,
  accept: PropTypes.string,
  removeFile: PropTypes.func,
  onPageEnter: PropTypes.func,
  onFileRemove: PropTypes.func,
  onInputChange: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default compose(
  withError,
  withForwardedRef,
)(FFMultiFileChannelInput);
