import React from 'react';
import { Heading } from 'components/layouts';
import styles from './styles.pcss';

export default function NotFoundList() {
  return <Heading level={4} className={styles.component}>Ничего не найдено</Heading>;
}
