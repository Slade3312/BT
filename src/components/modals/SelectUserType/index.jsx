import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RadioBoxGroup from 'components/fields/RadioBoxGroup';
import { Heading } from 'components/layouts';
import { ActionButton } from 'components/buttons/ActionButtons';
import { PopupStateless } from 'components/common';
import styles from './styles.pcss';

const options = [{
  value: 2,
  label: 'Юридическое лицо или\n индивидуальный\n предприниматель',
},
{
  value: 1,
  label: 'Физическое лицо',
}];

const SelectUserType = ({ giveAnswer, disableClose }) => {
  const [value, setValue] = useState(options[0].value);
  return (
    <PopupStateless
      opened
      onClose={() => {
      !disableClose && giveAnswer(false);
      }}
      hideCloseButton={disableClose}
    >
      <div className={styles.container}>
        <Heading level={2}>Оформить договор</Heading>
        <div className={styles.description}>Для запуска рекламной кампании вам нужно оформить договор</div>
        <RadioBoxGroup
          defaultValue={value}
          options={options}
          onChange={e => setValue(e)}
        />
        <ActionButton className={styles.btn} onClick={() => giveAnswer(value)}>
          Продолжить
        </ActionButton>
      </div>
    </PopupStateless>
  );
};

SelectUserType.propTypes = {
  giveAnswer: PropTypes.func,
  disableClose: PropTypes.any,
};

export default SelectUserType;
