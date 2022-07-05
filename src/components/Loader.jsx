import styles from '../styles/Loader.module.css';
import { Circles } from 'react-loader-spinner';

export const Loader = ({ color }) => (
  <div className={styles.Loader}>
    <Circles color={color} height={100} width={100} />
  </div>
);
// "react-loader-spinner": "^6.0.0-0",