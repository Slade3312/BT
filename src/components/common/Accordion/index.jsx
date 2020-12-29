import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { useLocation, navigate } from '@reach/router';
import qs from 'query-string';

import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';
import { PureButton } from 'components/buttons';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function Accordion({ question, answer, id }) {
  const location = useLocation();
  const { sections } = qs.parse(location.search);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimationFinish, setIsAnimationFinish] = useState(true);

  useEffect(() => {
    if (sections?.split(',')?.includes(id)) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [sections]);

  const handleOpenAnswer = () => {
    setIsAnimationFinish(false);
    const updSections = () => {
      if (sections) return `${sections},${id}`;
      return id;
    };
    navigate(`?sections=${updSections()}`);
  };

  const handleCloseAnswer = () => {
    const updSections = sections.split(',').filter(item => item !== id);
    if (updSections.length) {
      navigate(`?sections=${updSections.join()}`);
    } else {
      navigate(location.pathname);
    }
  };

  return (
    <>
      <CSSTransition
        in={isOpen}
        unmountOnExit
        id={id}
        timeout={0}
        classNames={{
          enter: cx('enter'),
          enterActive: cx('active-enter'),
          exit: cx('exit'),
          exitActive: cx('active-exit'),
        }}
        onExited={() => setIsAnimationFinish(true)}
      >
        <div className={cx('answerContainer')}>
          <h4 className={cx('questionTitle')}>{question}</h4>

          <div className={cx('answer')} dangerouslySetInnerHTML={{ __html: answer }} />

          <PureButton className={cx('closeButton')} onClick={handleCloseAnswer}>
            <GlobalIcon slug="cross" />
          </PureButton>
        </div>
      </CSSTransition>

      {!isOpen && isAnimationFinish && (
        <button type="button" className={cx('titleButton')} onClick={handleOpenAnswer}>
          {question}
        </button>
      )}
    </>
  );
}

Accordion.propTypes = {
  question: PropTypes.string,
  answer: PropTypes.string,
  id: PropTypes.string,
};
