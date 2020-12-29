import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Select } from 'components/fields';
import TextInput from 'components/fields/TextInput/components/TextInput';
import { PureButton, DeleteButton } from 'components/buttons';
import { GlobalIcon, LightText } from 'components/common';
import { SUGGEST_INPUT_ID, RADIUS_OPTIONS } from '../../constants';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function ChosenAddress({
  map,
  index,
  value,
  activeFieldIndex,
  radius,
  error,
  onRemoveClick,
  onAddressClick,
  onAddressChange,
  onActiveFieldIndexChange,
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [suggester, setSuggester] = useState();

  const [randomId] = useState(String(Math.random()).split('.')[1]);
  const [ymaps] = useState(window.ymaps);
  const [inputValue, setInputValue] = useState(value);
  const [radiusValue, setRadiusValue] = useState(radius);

  const handleEditClick = () => {
    if (inputValue !== value && radiusValue !== radius) {
      onAddressChange({ newRadius: radiusValue, newValue: inputValue, index });
    }
    if (inputValue !== value && radiusValue === radius) onAddressChange({ newValue: inputValue, index });
    if (radiusValue !== radius && inputValue === value) onAddressChange({ newRadius: radiusValue, index });

    onActiveFieldIndexChange(index);
    setIsEditable(prevIsEditable => !prevIsEditable);

    if (activeFieldIndex === index) {
      onActiveFieldIndexChange(null);
    }
  };

  const handleAddressChange = (newValue) => {
    setInputValue(newValue);
  };

  const handleAddressSelect = (e) => {
    setInputValue(e.get('item').value);
  };

  const handleRadiusChange = (newRadius) => {
    setRadiusValue(newRadius);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    setRadiusValue(radius);
  }, [radius]);

  useEffect(() => {
    if (ymaps && map && isEditable) {
      const suggestView = new ymaps.SuggestView(SUGGEST_INPUT_ID + randomId);
      setSuggester(suggestView);
      suggestView.events.add('select', handleAddressSelect);
    }

    setIsEditable(activeFieldIndex === index);

    return () => {
      if (suggester && ymaps && map) {
        suggester.events.remove('select', handleAddressSelect);
      }
    };
  }, [activeFieldIndex, map, isEditable]);

  return (
    <div className={cx('container', { hasPadding: !isEditable })}>
      <PureButton
        className={cx('marker')}
        onClick={onAddressClick}
      >
        <GlobalIcon slug="mapMarker" />
      </PureButton>

      {isEditable ? (
        <TextInput
          type="text"
          onChange={handleAddressChange}
          error={error}
          value={inputValue}
          id={SUGGEST_INPUT_ID + randomId}
          className={cx('editableInput')}
        />) : (
          <div className={cx('chosenItemContent')}>{value}</div>
      )}

      {isEditable ? (
        <Select
          value={radiusValue}
          placeholder={`${radiusValue}`}
          name="radius"
          options={RADIUS_OPTIONS}
          className={cx('radiusInput', { noMargin: isEditable })}
          onChange={handleRadiusChange}
        />
      ) : (
        <LightText className={cx('radiusText')}>{radius}</LightText>
      )}

      <PureButton
        onClick={handleEditClick}
        className={cx('button', { hasMargin: isEditable })}
      >
        {isEditable ? (
          <div className={cx('blackSquare')}>
            <GlobalIcon slug="smallShevron" />
          </div>
         ) : (
           <GlobalIcon slug="editSquare" />
        )}
      </PureButton>

      <DeleteButton
        className={
          cx('button', { hasMargin: isEditable, deleteButton: !isEditable })
        }
        onClick={() => onRemoveClick(index)}
      />
    </div>
  );
}

ChosenAddress.propTypes = {
  map: PropTypes.object,
  value: PropTypes.string,
  error: PropTypes.string,
  index: PropTypes.number,
  activeFieldIndex: PropTypes.number,
  radius: PropTypes.number,
  onRemoveClick: PropTypes.func,
  onAddressClick: PropTypes.func,
  onAddressChange: PropTypes.func,
  onActiveFieldIndexChange: PropTypes.func,
};

export default ChosenAddress;
