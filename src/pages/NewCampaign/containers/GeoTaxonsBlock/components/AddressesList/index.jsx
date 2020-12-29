import React from 'react';
import PropTypes from 'prop-types';

import ChosenAddress from '../ChosenAddress';

const AddressesList = ({
  map,
  fields,
  activeFieldIndex,
  fieldError,
  onAddressClick,
  onRemoveAddressClick,
  onAddressChange,
  onActiveFieldIndexChange,
}) => (
  <div>
    {fields.map((name, index) => (
      <ChosenAddress
        map={map}
        key={`${fields.value[index].address} ${String(Math.random())}`}
        index={index}
        error={fieldError}
        activeFieldIndex={activeFieldIndex}
        value={fields.value[index].address}
        radius={fields.value[index].radius / 1000}
        onRemoveClick={onRemoveAddressClick}
        onAddressClick={() => onAddressClick(index)}
        onAddressChange={onAddressChange}
        onActiveFieldIndexChange={onActiveFieldIndexChange}
      />
    ))}
  </div>
);

AddressesList.propTypes = {
  map: PropTypes.object,
  fields: PropTypes.shape({
    map: PropTypes.func,
    remove: PropTypes.func,
    value: PropTypes.array,
  }),
  onAddressClick: PropTypes.func,
  onRemoveAddressClick: PropTypes.func,
  onActiveFieldIndexChange: PropTypes.func,
  onAddressChange: PropTypes.func,
  fieldError: PropTypes.string,
  activeFieldIndex: PropTypes.number,
};

export default AddressesList;
