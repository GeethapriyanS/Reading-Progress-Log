import Link from 'next/link';
import styles from './page.module.css'; 

export default function HomePage() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Track Your Reading Journey</h1>
        <p className={styles.heroSubtitle}>
          Stay organized, set reading milestones, and visualize your progress with a premium personal reading assistant.
        </p>
        <div className={styles.buttons}>
          <Link href="/login" className={styles.primaryButton}>
            Login to Account
          </Link>
          <Link href="/register" className={styles.secondaryButton}>
            Register Now
          </Link>
          <Link href="/dashboard" className={styles.dashboardButton}>
            Go to Dashboard
          </Link>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📚</div>
            <h3>Smart Bookshelf</h3>
            <p>Organize books into &quot;Yet to Start&quot;, &quot;Reading&quot;, and &quot;Completed&quot;. Track pages read and view detailed timelines.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Auto Book Lookup</h3>
            <p>Search books by title using Open Library API integration to instantly fetch page counts, descriptions, tags, and cover art.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Reading Analytics</h3>
            <p>Visualize your progress through interactive SVG graphs showing your weekly page output and genre distribution.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Dynamic Goals</h3>
            <p>Set custom page count or book count goals with dynamic progress tracking that auto-calculates as you update your reading.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✍️</div>
            <h3>Notes & Quotes</h3>
            <p>Log key quotes with page numbers, document thoughts dynamically, and save ratings and reviews upon completion.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Responsive UI</h3>
            <p>Enjoy a responsive, fast, glassmorphic dark interface optimized for desktop, tablets, and mobile devices.</p>
          </div>
        </div>
      </div>
    </div>
  );
}