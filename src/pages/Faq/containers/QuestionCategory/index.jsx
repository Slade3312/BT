import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import classNames from 'classnames/bind';
import { Heading } from 'components/layouts';
import { StoresContext } from 'store/mobx';

import Accordion from 'components/common/Accordion';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function QuestionCategory() {
  const { Faq: { currentCategoryFaq } } = useContext(StoresContext);
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={currentCategoryFaq.category}
        timeout={300}
        classNames={{
          enter: cx('enter'),
          enterActive: cx('active-enter'),
          enterDone: cx('enter-done'),
          exit: cx('exit'),
          exitActive: cx('active-exit'),
        }}
      >
        <section className={cx('component')}>
          <div className={cx('headingWrapper')}>
            <Heading level={3}>{currentCategoryFaq.category}</Heading>
          </div>

          {currentCategoryFaq?.faqs?.map(item => (
            <Accordion
              key={item.question}
              question={item.question}
              answer={item.answer}
              id={item.id}
            />
          ))}
        </section>
      </CSSTransition>
    </SwitchTransition>
  );
}

export default observer(QuestionCategory);
