import type { JSX } from 'react';

import styles from './loader.module.css';

export function Loader(): JSX.Element {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
}
