import React from 'react';
import { PropTypes } from 'prop-types';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

export default function FadeTransitionWrapper({ children, currentIndex, className }) {
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={currentIndex}
        timeout={300}
        classNames={{
          enter: cx('enter'),
          enterActive: cx('active-enter'),
          exit: cx('exit'),
          exitActive: cx('active-exit'),
        }}
      >
        <div className={className}>
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}

FadeTransitionWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  currentIndex: PropTypes.number,
};
