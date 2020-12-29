import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { PureButton } from 'components/buttons';
import styles from './styles.pcss';

const buttonItems = [
  { title: 'Здравствуйте!', message: 'Здравствуйте!' },
  { title: 'Помогите настроить кампанию', message: 'Помогите настроить кампанию' },
];

function MegaButtons() {
  const { Chat } = useContext(StoresContext);

  const [lockedButtons, setLockedButtons] = useState({});

  const handleButtonClick = (msg) => {
    Chat.webSocketConnector.send({ message: msg });

    setLockedButtons({ ...lockedButtons, [msg]: true });
  };

  const buttonsToView = buttonItems.filter(({ message }) => !lockedButtons[message]);

  if (!buttonsToView.length) return null;

  return (
    <div className={styles.container}>
      {buttonsToView.map(({ title, message }) => (
        <PureButton
          key={title}
          className={styles.button}
          type="button"
          onClick={() => handleButtonClick(message)}
      >
          {title}
        </PureButton>
      ))}
    </div>
  );
}

export default observer(MegaButtons);
