import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import styles from "./About.module.css"

function useReveal() {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold: 0.1 }
        )
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])
    return [ref, visible]
}

const VALUES = [
    { num: "01", title: "Authentic only.", body: "Every product on Zeno is sourced directly or through verified distributors. No grey market. No compromise." },
    { num: "02", title: "Editorial curation.", body: "We don't stock everything. We stock what's worth owning — chosen with the same precision a magazine editor applies to a cover story." },
    { num: "03", title: "Lagos-first.", body: "Built in Nigeria, for Nigeria. Pricing, delivery, and support are designed around how people actually live and shop here." },
    { num: "04", title: "Precision in detail.", body: "From the product page to the packaging to the follow-up — every touchpoint is considered. Nothing is accidental." },
]

const STATS = [
    { num: "2023", label: "Founded" },
    { num: "500+", label: "Products" },
    { num: "24h", label: "Avg. delivery" },
    { num: "100%", label: "Authentic" },
]

export default function About() {
    const [heroRef, heroVisible] = useReveal()
    const [valuesRef, valuesVisible] = useReveal()
    const [quoteRef, quoteVisible] = useReveal()
    const [statsRef, statsVisible] = useReveal()

    return (
        <main className={styles.page}>

            <section className={styles.hero}>
                <div className={styles.heroGrid} aria-hidden="true" />
                <div className={styles.heroOrb} aria-hidden="true" />
                <span className={styles.heroSpine} aria-hidden="true">
                    Zeno Electronics — Technology, precisely — Lagos, Nigeria
                </span>

                <div
                    ref={heroRef}
                    className={`${styles.heroContent} ${heroVisible ? styles.visible : ""}`}
                >
                    <span className={styles.eyebrow}>About Zeno</span>
                    <h1 className={styles.heroHeadline}>
                        Technology,<br />
                        <span className={styles.accent}>precisely.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        We are not a gadget store. We are an editorial
                        technology house — curating the devices that define
                        how Nigeria's next generation works, creates, and lives.
                    </p>
                </div>

                <div
                    ref={statsRef}
                    className={`${styles.statsBar} ${statsVisible ? styles.visible : ""}`}
                >
                    {STATS.map(({ num, label }) => (
                        <div key={label} className={styles.stat}>
                            <span className={styles.statNum}>{num}</span>
                            <span className={styles.statLabel}>{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section
                ref={valuesRef}
                className={`${styles.values} ${valuesVisible ? styles.visible : ""}`}
            >
                <div className={styles.valuesHeader}>
                    <div className={styles.valuesHeaderLeft}>
                        <span className={styles.sectionEyebrow}>What we stand for</span>
                        <h2 className={styles.sectionHeading}>The Zeno standard.</h2>
                    </div>
                    <p className={styles.valuesNote}>
                        Four principles.<br />No exceptions.
                    </p>
                </div>

                <div className={styles.valuesGrid}>
                    {VALUES.map(({ num, title, body }) => (
                        <div
                            key={num}
                            className={styles.valueCard}
                            data-num={num}
                        >
                            <span className={styles.valueNum}>{num}</span>
                            <h3 className={styles.valueTitle}>{title}</h3>
                            <p className={styles.valueBody}>{body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section
                ref={quoteRef}
                className={`${styles.manifesto} ${quoteVisible ? styles.visible : ""}`}
            >
                <div className={styles.manifestoInner}>
                    <span className={styles.manifestoMark} aria-hidden="true">"</span>
                    <blockquote className={styles.quote}>
                        Most stores sell you a device.<br />
                        We sell you the <em>right</em> one.
                    </blockquote>
                    <cite className={styles.quoteCite}>The Zeno Promise</cite>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.ctaInner}>
                    <h2 className={styles.ctaHeading}>Ready to find yours?</h2>
                    <Link to="/shop" className={styles.ctaBtn}>
                        <span>Browse the collection</span>
                        <span>→</span>
                    </Link>
                </div>
            </section>

        </main>
    )
}