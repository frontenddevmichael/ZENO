import { Link } from "react-router-dom"
import styles from "./Footer.module.css"

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>

                {/* ── TOP ROW ── */}
                <div className={styles.footerTop}>

                    {/* Wordmark block */}
                    <div className={styles.wordmark}>
                        <span className={styles.wordmarkEyebrow}>zeno.ng</span>
                        <h2 className={styles.wordmarkName}>ZENO</h2>
                        <p className={styles.wordmarkTagline}>
                            Curating the future of consumer technology with editorial precision.
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className={styles.navCol} aria-label="Site navigation">
                        <span className={styles.colHeading}>Navigate</span>
                        <Link to="/" className={styles.navLink}>
                            Home <span className={styles.arrow}>→</span>
                        </Link>
                        <Link to="/shop" className={styles.navLink}>
                            Shop <span className={styles.arrow}>→</span>
                        </Link>
                        <Link to="/contact" className={styles.navLink}>
                            Contact <span className={styles.arrow}>→</span>
                        </Link>
                    </nav>

                    {/* Support */}
                    <nav className={styles.navCol} aria-label="Support links">
                        <span className={styles.colHeading}>Support</span>
                        <a
                            href="https://wa.me/yournumber"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.navLink}
                        >
                            WhatsApp <span className={styles.arrow}>→</span>
                        </a>
                        <a
                            href="mailto:hello@zeno.ng"
                            className={styles.navLink}
                        >
                            Email <span className={styles.arrow}>→</span>
                        </a>
                        <Link to="/returns" className={styles.navLink}>
                            Return Policy <span className={styles.arrow}>→</span>
                        </Link>
                    </nav>

                </div>

                {/* ── BOTTOM ROW ── */}
                <div className={styles.footerBottom}>
                    <p className={styles.copyright}>
                        &copy;{new Date().getFullYear()} ZENO Electronics. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    )
}