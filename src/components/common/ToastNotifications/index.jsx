import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.pcss';

export default function ToastNotifications() {
  return <ToastContainer className={styles.component} />;
}

