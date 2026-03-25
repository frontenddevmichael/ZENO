import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

const SPECS = [
    { label: 'Display', value: '6.7"  OLED', delay: '0.9s' },
    { label: 'Chip', value: 'A18 Pro', delay: '1.1s' },
    { label: 'Camera', value: '48 MP  f/1.8', delay: '1.3s' },
    { label: 'Battery', value: '4,685 mAh', delay: '1.5s' },
]

export default function Hero() {
    return (
        <section className={styles.hero}>

            <div className={styles.bgImage} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />


            <div className={styles.floatingCards} aria-hidden="true">
                {SPECS.map(({ label, value, delay }) => (
                    <div
                        key={label}
                        className={styles.specCard}
                        style={{ '--card-delay': delay }}
                    >
                        <span className={styles.specLabel}>{label}</span>
                        <span className={styles.specValue}>{value}</span>
                    </div>
                ))}
            </div>

            <div className={styles.content}>
                <span className={styles.eyebrow}>Technology, precisely.</span>

                <h1 className={styles.headline}>
                    <span className={styles.headlineLine}>The future of tech,</span>
                    <span className={`${styles.headlineLine} ${styles.headlineAccent}`}>curated.</span>
                </h1>

                <p className={styles.subtext}>
                    Premium devices. Editorial selection.
                    <br className={styles.desktopBreak} />
                    Delivered across Nigeria.
                </p>

                <div className={styles.actions}>
                    <Link to="/shop" className={styles.btnPrimary}>Shop Now</Link>
                    <Link to="/about" className={styles.btnSecondary}>Our Story</Link>
                </div>

                <div className={styles.statsRow}>
                    <div className={styles.stat}>
                        <span className={styles.statNum}>500+</span>
                        <span className={styles.statLabel}>Products</span>
                    </div>
                    <span className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.stat}>
                        <span className={styles.statNum}>24h</span>
                        <span className={styles.statLabel}>Delivery</span>
                    </div>
                    <span className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.stat}>
                        <span className={styles.statNum}>100%</span>
                        <span className={styles.statLabel}>Authentic</span>
                    </div>
                </div>
            </div>

            <div className={styles.scrollHint} aria-hidden="true">
                <span className={styles.scrollLine} />
            </div>

        </section>
    )
}