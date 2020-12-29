import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { PopupStateless } from 'components/common/Popup/components/Popup';
import { ActionButton } from 'components/buttons/ActionButtons';
import { StoresContext } from 'store/mobx';
import { Heading } from 'components/layouts';
import styles from './styles.pcss';

export default function CheckNumberModal({ onComplete }) {
  const { Templates } = useContext(StoresContext);

  const Template = Templates.getCommonTemplate('CheckNumberModal');

  return (
    <PopupStateless
      opened
      onClose={() => onComplete(false)}
      className={styles.content}
  >
      {Template.title && <Heading level={2} className={styles.title}>
        {Template.title}
      </Heading>}

      <Heading level={4} className={styles.description}>
        {Template.description}
      </Heading>

      <ActionButton onClick={() => onComplete(true)}>
        {Template.buttonText}
      </ActionButton>
    </PopupStateless>
  );
}

CheckNumberModal.propTypes = {
  onComplete: PropTypes.func,
};
