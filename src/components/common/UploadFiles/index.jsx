import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.pcss';


const UploadFiles = (props) => {
  const uploadContainer = useRef();
  let counter = 0;
  const [isDragging, setDragging] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
      counter += 1;
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    counter -= 1;
    if (counter === 0) {
      setDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      props.handleDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };
  useEffect(() => {
    document.body.addEventListener('dragenter', handleDragIn);
    document.body.addEventListener('dragleave', handleDragOut);
    document.body.addEventListener('dragover', handleDrag);
    uploadContainer.current.addEventListener('drop', handleDrop);
    return () => {
      document.body.removeEventListener('dragenter', handleDragIn);
      document.body.removeEventListener('dragleave', handleDragOut);
      document.body.removeEventListener('dragover', handleDrag);
      uploadContainer.current.removeEventListener('drop', handleDrop);
    };
  }, []);
  return (
    <div
      className={`${isDragging && styles.container}`}
      ref={uploadContainer}
    >
      {isDragging && <span className={styles.dropFilesTitle}>Перетащите ваши файлы сюда</span> || null}
    </div>
  );
};

UploadFiles.propTypes = {
  handleDrop: PropTypes.func,
};

export default UploadFiles;
