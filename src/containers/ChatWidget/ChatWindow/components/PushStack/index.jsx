import React from 'react';
import PropTypes from 'prop-types';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import BotTooltip from 'containers/ChatWidget/BotTootip';
import styles from './styles.pcss';

export default function PushStack({ items, onItemClick, onItemClose }) {
  return (
    <TransitionGroup className={styles.component}>
      {items.map((value) => (
        <CSSTransition
          key={value.id}
          timeout={500}
          classNames={{
              enter: styles.enter,
              enterActive: styles.enterActive,
              exit: styles.exit,
              exitActive: styles.exitActive,
          }}>
          <div className={styles.wrapper}>
            <BotTooltip
              isOpen
              content={value.message}
              author={value.author}
              avatar={value.avatar}
              onClick={() => onItemClick(value)}
              onClose={() => onItemClose(value)}
              type={value.type}
              />
          </div>
        </CSSTransition>
        ))}
    </TransitionGroup>
  );
}

PushStack.propTypes = {
  items: PropTypes.object,
  onItemClick: PropTypes.func,
  onItemClose: PropTypes.func,
};
