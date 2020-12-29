import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { usePrevious } from './hooks';
import styles from './styles.pcss';

const Stepper = forwardRef(({ children, className = '', step, openedContainerClass = '' }, ref) => {
  const prevStep = usePrevious(step);
  const getBadgeClassName = (isActive, isCompleted) => {
    if (isActive) return styles.active;
    if (isCompleted) return styles.completed;
    return styles.inactive;
  };
  const getTitleClassName = (isActive, isCompleted) => {
    if (!isActive && !isCompleted) return styles.inactiveText;
    return null;
  };
  const getMenuItems = () => {
    return children.map((item, index) => {
      if (item.props.isCompleted && !item.props.isActive) return null;
      return (
        <>
          {
            (item.props.isActive || !item.props.wasOpened) &&
            <div
              onClick={() => {
                item.props.setActiveStep();
              }}
              className={styles.menuItem}
            >
              <div className={`${styles.stepLabel} ${getBadgeClassName(item.props.isActive, item.props.isCompleted)}`}>{index + 1}</div>
              <span className={getTitleClassName(item.props.isActive, item.props.isCompleted)}>{item.props.title}</span>
            </div>
          }
        </>
      );
    });
  };

  const displayTopLine = (prev, current) => {
    if (
      (prev && (prev.props.isActive || prev.props.isCompleted || prev.props.wasOpened)) ||
      prev && current && current.props.isActive
    ) {
      return styles.topLine;
    }
    return null;
  };

  const displayBottomLine = (current, next) => {
    if (
      next &&
      (current.props.isCompleted || current.props.wasOpened) && !current.props.isActive && !next.props.wasOpened && !next.props.isCompleted) {
      return styles.bottomLine;
    }
    return null;
  };

  return (
    <div ref={ref}>
      {
        children.map((item, index) => {
          const isCompleted = !item.props.isActive && item.props.isCompleted;
          const isActive = item.props.isActive;
          const wasOpened = item.props.wasOpened;
          return (
            <div>
              {
                isActive &&
                <div
                  className={`${styles.holder} ${displayTopLine(children[index - 1], item)}`}
                  key={index} // eslint-disable-line
                >
                  <div className={className}>
                    <div>
                      {
                        isActive &&
                        getMenuItems()
                      }
                    </div>
                  </div>

                  {
                    item.props.isActive &&
                    <div className={openedContainerClass}>
                      <div className={`${styles.openedContainer} ${prevStep > step ? styles.openUp : styles.openDown}`}>{item.props.openedComponent}</div>
                    </div>
                  }

                </div> || isCompleted && !isActive &&
                <div className={`${styles.completedContainer} ${displayTopLine(children[index - 1], item)} ${displayBottomLine(item, children[index + 1])}`}>
                  <div className={className}>
                    <div
                      onClick={item.props.setActiveStep}
                      className={styles.menuItem}
                    >
                      <div className={`${styles.stepLabel} ${getBadgeClassName(item.props.isActive, item.props.isCompleted)}`}>{index + 1}</div>
                      <span className={getTitleClassName(item.props.isActive, item.props.isCompleted)}>{item.props.title}</span>
                    </div>
                  </div>
                  <div className={styles.completedComponent}>{item.props.closedComponent}</div>
                </div> || !isActive && !isCompleted && wasOpened &&
                <div className={`${styles.completedContainer} ${displayTopLine(children[index - 1])} ${displayBottomLine(item, children[index + 1])}`}>
                  <div className={className}>
                    <div
                      onClick={item.props.setActiveStep}
                      className={styles.menuItem}
                    >
                      <div className={`${styles.stepLabel} ${getBadgeClassName(item.props.isActive, item.props.isCompleted)}`}>{index + 1}</div>
                      <span className={getTitleClassName(item.props.isActive, item.props.isCompleted)}>{item.props.title}</span>
                    </div>
                  </div>
                  <div className={styles.completedComponent}>{item.props.closedComponent}</div>
                </div>
              }
            </div>
          );
        })
      }
    </div>
  );
});

Stepper.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  openedContainerClass: PropTypes.string,
  step: PropTypes.number,
};

const Step = ({ openedComponent, className = '' }) => {
  return <div className={className}>{openedComponent}</div>;
};

Step.propTypes = {
  openedComponent: PropTypes.any,
  className: PropTypes.string,
};

export { Stepper, Step };
