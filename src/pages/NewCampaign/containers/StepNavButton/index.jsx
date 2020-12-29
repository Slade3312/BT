import React from 'react';
import PropTypes from 'prop-types';
import { ActionButton } from 'components/buttons';

function StepNavButton({
  children,
  onClick,
  className,
  isDisabled,
}) {
  return (
    <ActionButton
      isDisabled={isDisabled}
      onClick={onClick}
      className={className}
      type="button"
      iconSlug="arrowRightMinimal"
    >
      {children}
    </ActionButton>
  );
}

StepNavButton.propTypes = {
  isDisabled: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default StepNavButton;
