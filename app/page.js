import Link from 'next/link';
import styles from './page.module.css'; 

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Your Reading Log</h1>
      <p className={styles.description}>
        Track your reading progress, set goals, and stay motivated.
      </p>
      <div className={styles.buttons}>
        <Link href="/login" className={styles.button}>
          Login
        </Link>
        <Link href="/register" className={styles.button}>
          Sign Up
        </Link>
        <Link href="/dashboard" className={styles.button}>
          Go to Dashboard (for logged-in users)
        </Link>
      </div>
    </div>
  );
}