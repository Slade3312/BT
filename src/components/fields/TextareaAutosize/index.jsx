import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CustomPropTypes from 'utils/prop-types';
import { withForwardedRef } from 'enhancers';
import styles from './styles.pcss';

function TextareaAutosize({ value, onChange, className, maxHeight, forwardedRef, ...nativeProps }) {
  const pseudoRef = useRef();
  const textareaRef = forwardedRef;
  const parentContainer = useRef();

  function updateHeight() {
    requestAnimationFrame(() => {
      const pseudoHeight = pseudoRef.current.getBoundingClientRect().height;
      const height = pseudoHeight > maxHeight ? maxHeight : pseudoHeight;

      parentContainer.current.style.height = `${height}px`;
      pseudoRef.current.style.width = `${textareaRef.current.getBoundingClientRect().width}px`;
    });
  }

  useEffect(() => {
    // just will not show scroll bar for textarea field, don't support showing scrollbar
    // new PerfectScrollbar(textareaRef.current, { wheelPropagation: true });
  }, []);

  useEffect(() => {
    updateHeight();
  }, [value]);

  return (
    <div ref={parentContainer} className={classNames(styles.component, className)}>
      <div ref={pseudoRef} className={styles.pseudo}>
        {!value ? 'any text' : `${value}\n`}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        className={styles.textarea}
        {...nativeProps}
      />
    </div>
  );
}

TextareaAutosize.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  maxHeight: PropTypes.number,
  forwardedRef: CustomPropTypes.ref,
};

export default withForwardedRef(TextareaAutosize);
