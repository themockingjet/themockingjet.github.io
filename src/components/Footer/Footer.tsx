import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Footer">
      <span className={styles.copy}>© {new Date().getFullYear()} themockingjet</span>
      <span className={styles.stack}>vite · react · typescript</span>
    </footer>
  )
}
