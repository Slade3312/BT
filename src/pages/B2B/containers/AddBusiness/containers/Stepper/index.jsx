import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const getStepTitleById = {
  1: 'Добавить первый бизнес',
  2: 'Добавить акцию к бизнесу',
  3: 'Как найти сотрудничество',
};

const stepsDisplayed = [1, 2, 3];

const Stepper = observer(() => {
  const { Tinder } = useContext(StoresContext);
  return (
    <div className={styles.stepsHolder}>
      {
        stepsDisplayed.map(item => {
            return (
              <>
                <div className={cx('step', {
                    passed: Tinder.stepsPassed.includes(item),
                    active: item === Tinder.introStep,
                })}>
                  {item}
                </div>
                {
                    item === Tinder.introStep &&
                    <div className={styles.title}>{getStepTitleById[Tinder.introStep]}</div>
                }
              </>
            );
        })
      }
    </div>
  );
});

export default Stepper;
