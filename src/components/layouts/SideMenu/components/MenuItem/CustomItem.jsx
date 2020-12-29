import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

export default function CustomItem({
  title,
}) {
  return (
    <a
      href="https://oprosso.net/p/3DTZA9tSfrYqtdtxx"
      target="_blank"
      rel="noreferrer"
      className={`${styles.component} ${styles.accessible} ${styles.custom}`}
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg width="19" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16.511l-2.31-3.95c.627-1.111.99-2.417.99-3.789C16.68 4.462 13.18 1 8.856 1 4.5 1 1 4.462 1 8.772c0 4.31 3.499 7.74 7.856 7.74H18z" stroke="#1A1507" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round"/>
            <path d="M5.126 8.772l2.146 2.123 5.116-5.062" stroke="#1A1507" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round"/>
          </svg>
        </div>

        <span className={styles.link}>{title}</span>
      </div>
    </a>
  );
}

CustomItem.propTypes = {
  title: PropTypes.string,
};
