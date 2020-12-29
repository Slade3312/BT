import React from 'react';

import { FFTextArea } from 'components/fields';
import { ORDER_ADD_INFO_FIELD } from 'store/NewCampaign/channels/constants';

import FieldLabel from '../FieldLabel';
import styles from './styles.pcss';

const Comment = () => (
  <div className={styles.fieldRow}>
    <FieldLabel
      className={styles.label}
      text="Комментарий"
    />

    <FFTextArea
      placeholder="Ваш комментарий"
      name={ORDER_ADD_INFO_FIELD}
      maxLength={1000}
      keepErrorIndent={false}
      className={styles.textArea}
    />
  </div>
);

export default Comment;
