import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { LightText } from 'components/common';
import { IconLink } from 'components/buttons/IconLinks';
import { MultiFileUploadInput } from 'components/fields/FileInputs/components';
import styles from './styles.pcss';

export default function UploadFiles({
  onFilesAdded,
  uploadFilesText,
  uploadFilesButton,
  formatLabel,
  templateLink,
  darkFormatText,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const targetRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    onFilesAdded(e.dataTransfer.files);

    e.dataTransfer.clearData();

    targetRef.current.value = '';
  };

  const handleFileChange = (files) => {
    onFilesAdded(files);

    targetRef.current.value = '';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };


  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };


  return (
    <>
      <div className={styles.labelContent}>
        {
          darkFormatText &&
          <div className={`${styles.dark} ${styles.formatLabel}`}>{formatLabel}</div> ||
          <LightText className={styles.formatLabel}>{formatLabel}</LightText>
        }

        {templateLink && (
          <IconLink target="_blank" href={templateLink} slug="">
            Скачать шаблон
          </IconLink>
        )}
      </div>

      <label
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={classNames(styles.container, isDragging && styles.active)}
      >
        <MultiFileUploadInput
          ref={targetRef}
          onChange={handleFileChange}
          accept=".txt,.csv,.xlsx"
      >
          <p className={styles.insideText}>
            {uploadFilesText} {' '}

            <span className={styles.buttonText}>{uploadFilesButton}</span>
          </p>
        </MultiFileUploadInput>
      </label>
    </>
  );
}

UploadFiles.propTypes = {
  onFilesAdded: PropTypes.func,
  uploadFilesText: PropTypes.string,
  uploadFilesButton: PropTypes.string,
  formatLabel: PropTypes.string,
  templateLink: PropTypes.string,
  darkFormatText: PropTypes.string,
};
