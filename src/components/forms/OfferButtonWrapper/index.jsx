import React from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';
import { ActionButton } from 'components/buttons';
import { OFFER_CHECKED_FIELD } from '../../../constants';


function OfferButtonWrapper({ buttonText, className }) {
  const { values: { [OFFER_CHECKED_FIELD]: checked } } = useFormState();
  return (
    <ActionButton
      type="submit"
      className={className}
      isDisabled={!checked}
    >
      {buttonText}
    </ActionButton>
  );
}

OfferButtonWrapper.propTypes = {
  buttonText: PropTypes.string,
  className: PropTypes.string,
};

export default OfferButtonWrapper;
