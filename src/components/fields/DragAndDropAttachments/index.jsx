import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.pcss';

const preventEvents = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

export default function DragAndDropAttachments({
  children,
  onDropFiles,
  className,
  message,
  disabled,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const parentRef = useRef();

  const handleDrop = (e) => {
    preventEvents(e);

    if (!disabled) {
      setIsDragging(false);
      onDropFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragLeave = (e) => {
    preventEvents(e);

    setIsDragging(false);
  };


  const handleDragOver = (e) => {
    preventEvents(e);
  };

  const handleDragEnter = (e) => {
    preventEvents(e);

    if (!disabled) {
      setIsDragging(true);
    }
  };

  useEffect(() => {
    if (disabled && isDragging) {
      setIsDragging(false);
    }
  }, [disabled]);

  return (
    <div
      className={classNames(styles.component, className)}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      ref={parentRef}
    >
      <div onDragLeave={handleDragLeave} className={classNames(styles.overlay, isDragging && styles.active)}>
        <div className={styles.overlayWrapper}>
          {message}
        </div>
      </div>

      {children}

    </div>
  );
}

DragAndDropAttachments.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onDropFiles: PropTypes.func,
  message: PropTypes.string,
  disabled: PropTypes.bool,
};
