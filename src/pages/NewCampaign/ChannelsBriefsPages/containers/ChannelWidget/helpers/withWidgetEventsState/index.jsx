import React, { useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './styles.pcss';

const withWidgetEventsState = (WrappedComponent) => {
  const WidgetEventController = (props) => {
    const [isMouseOverWidget, setMouseOverWidget] = useState(false);

    const handleMouseEnter = () => setMouseOverWidget(true);
    const handleMouseLeave = () => setMouseOverWidget(false);

    return (
      <div
        className={classNames(
          styles.container,
          props.isDisabled && styles.disabled,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <WrappedComponent {...props} isMouseOverWidget={isMouseOverWidget} />
      </div>
    );
  };

  WidgetEventController.propTypes = {
    isDisabled: PropTypes.bool,
  };

  return WidgetEventController;
};

export default withWidgetEventsState;
