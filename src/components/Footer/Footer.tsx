import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Footer">
      <span>© {new Date().getFullYear()} themockingjet</span>
      <span className={styles.stack}>Built with Vite, React and TypeScript</span>
    </footer>
  )
}
