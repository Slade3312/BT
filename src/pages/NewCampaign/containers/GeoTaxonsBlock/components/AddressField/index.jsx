import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { TextInput } from 'components/fields/TextInput';
import { ActionButton } from 'components/buttons';
import { Select } from 'components/fields';
import { LightText } from 'components/common';

import LabeledFieldWrapper from '../LabeledFieldWrapper';
import { SUGGEST_INPUT_ID, RADIUS_OPTIONS } from '../../constants';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function AddressField({
  onAddressChange,
  onRadiusChange,
  error,
  value,
  radiusValue,
  onAddAddressClick,
  index,
  id,
  templatesData,
}) {
  const handleAddressChange = (val) => {
    onAddressChange({ val, index });
  };

  const handleRadiusChange = (val) => {
    onRadiusChange({ val, index });
  };

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      e.preventDefault();
      e.stopPropagation();

      onAddAddressClick();
    }
  };

  return (
    <div>
      <div className={cx('address')}>
        <LabeledFieldWrapper className={cx('fullWidth')}>
          <LightText className={cx('fieldFont')} tooltip={templatesData.tooltip || ''}>
            {templatesData.label || ''}
          </LightText>

          <TextInput
            type="text"
            onChange={handleAddressChange}
            onKeyPress={handleKeyPress}
            error={error}
            value={value}
            id={SUGGEST_INPUT_ID + id}
            placeholder={templatesData.inputPlaceholder || ''}
          />
        </LabeledFieldWrapper>

        <LabeledFieldWrapper>
          <LightText className={cx('fieldFont', 'leftIndent')}>{templatesData.radiusLabel || ''}</LightText>

          <Select
            name="radius"
            value={radiusValue}
            options={RADIUS_OPTIONS}
            className={cx('radiusInput')}
            onChange={handleRadiusChange}
          />
        </LabeledFieldWrapper>

        <ActionButton
          className={cx('addressButton')}
          onClick={onAddAddressClick}
          iconSlug="arrowRightMinimal"
        >
          {templatesData.buttonText || ''}
        </ActionButton>
      </div>
    </div>
  );
}

AddressField.propTypes = {
  templatesData: PropTypes.shape({
    tooltip: PropTypes.string,
    label: PropTypes.string,
    radiusLabel: PropTypes.string,
    buttonText: PropTypes.string,
    inputPlaceholder: PropTypes.string,
  }),
  onAddressChange: PropTypes.func,
  onRadiusChange: PropTypes.func,
  error: PropTypes.string,
  value: PropTypes.string,
  radiusValue: PropTypes.number,
  id: PropTypes.string,
  index: PropTypes.number,
  onAddAddressClick: PropTypes.func,
};

export default AddressField;
