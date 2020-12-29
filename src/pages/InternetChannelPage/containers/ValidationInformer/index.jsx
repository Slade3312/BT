import React, { useMemo, useRef, useState, useEffect, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { DISTANCE_TO_NEAREST_ERROR_FIELD } from 'constants/index';
import { scrollSmoothTo } from 'utils/scroll';
import styles from './styles.pcss';

let timerId = null;

const focusWithDelay = (node) => {
  timerId = setTimeout(() => node.focus(), 500);
};

const focusOnNearestInput = (node) => {
  if (node.nodeName.toLocaleLowerCase() === 'input') {
    focusWithDelay(node);
  } else {
    const inputNode = node.getElementsByTagName('input')[0];
    if (inputNode) focusWithDelay(inputNode);
  }
};

export default function ValidationInformer({ className, fieldsLabelsByName = {}, errors }) {
  const elemRef = useRef(null);
  const [formFieldNames, setFormFieldNames] = useState([]);
  const [formFieldNodesMap, setFormFieldNodesMap] = useState([]);

  const fieldsWithInfo = useMemo(() => {
    const result = [];

    formFieldNames.forEach((fieldName) => {
      if (errors[fieldName]) {
        result.push({ name: fieldName, label: fieldsLabelsByName[fieldName] });
      }
    });

    return result;
  }, [errors, formFieldNames]);

  const handleClick = (fieldName) => {
    const fieldNode = formFieldNodesMap[fieldName];
    const pos = fieldNode.getBoundingClientRect().top + pageYOffset - DISTANCE_TO_NEAREST_ERROR_FIELD;
    clearTimeout(timerId);
    focusOnNearestInput(fieldNode);
    scrollSmoothTo(pos);
  };

  useEffect(() => {
    const form = elemRef.current.closest('form');
    const formFields = form.querySelectorAll('[name]');
    const fieldNamesList = [];
    const fieldNodesMap = [];
    formFields.forEach((field) => {
      const name = field.getAttribute('name');
      fieldNamesList.push(name);
      fieldNodesMap[name] = field;
    });
    setFormFieldNames(fieldNamesList.filter(name => name.indexOf('.') === -1));
    setFormFieldNodesMap(fieldNodesMap);
  }, [setFormFieldNames]);

  const hasErrors = fieldsWithInfo.length > 0;

  return (
    <div ref={elemRef} className={classNames(styles.component, className)}>
      {hasErrors && (
        <div className={styles.wrapper}>
          Осталось заполнить{' '}
          {fieldsWithInfo.map(({ name, label }, index) => {
            if (index !== fieldsWithInfo.length - 1) {
              return (
                <Fragment key={name}>
                  <span className={styles.field} onClick={() => handleClick(name)}>
                    {label}
                  </span>
                  {index !== fieldsWithInfo.length - 2 && ', '}
                </Fragment>
              );
            }
            return (
              <Fragment key={name}>
                {fieldsWithInfo.length > 1 && ' и '}
                <span className={styles.field} onClick={() => handleClick(name)}>
                  {label}
                </span>
                .
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

ValidationInformer.propTypes = {
  className: PropTypes.string,
  fieldsLabelsByName: PropTypes.object,
  errors: PropTypes.object,
};
