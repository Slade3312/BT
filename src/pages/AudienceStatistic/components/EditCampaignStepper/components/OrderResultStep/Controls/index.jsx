import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';
import { ActionButton } from 'components/buttons';

const Controls = ({ className, onClick, buttonText }) => {
  const {
    CreateReport: {
      set,
    },
  } = useContext(StoresContext);

  return (
    <ActionButton
      className={className}
      onClick={(event) => {
        onClick ? onClick(event) : set('isModalVisible', false);
      }}
    >
      {buttonText || 'Завершить'}
    </ActionButton>
  );
};

Controls.propTypes = {
  className: PropTypes.string,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
};

export default observer(Controls);
