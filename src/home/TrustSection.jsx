import styles from './TrustSection.module.css'
import { useEffect, useRef, useState } from 'react'

const PILLARS = [
    {
        number: '01',
        title: 'Authenticity Guaranteed',
        body: 'Every device is sourced directly from authorised distributors. Manufacturer seal intact, always.',
        detail: 'We carry no grey market stock. What you order is what leaves the warehouse.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
            </svg>
        )
    },
    {
        number: '02',
        title: '7-Day Returns. 6-Month Warranty.',
        body: '7-day returns on all orders. 6-month warranty on every device. Reach us on WhatsApp — we respond within the hour.',
        detail: 'No lengthy processes. Message us, describe the issue, we handle the rest.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        number: '03',
        title: 'Fast Delivery Nationwide',
        body: 'Lagos: 24–48 hours. Other states: 48–72 hours. Order before 2PM, ships same day.',
        detail: 'We deliver to all 36 states. Tracking updates sent via WhatsApp.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        )
    },
]

function useFadeInOnScroll() {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold: 0.15 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return { ref, visible }
}

export default function TrustSection() {
    const { ref, visible } = useFadeInOnScroll()

    return (
        <section className={styles.section} ref={ref}>

            {/* Ambient glow */}
            <div className={styles.glow} aria-hidden="true" />

            <div className={styles.inner}>

                {/* Header */}
                <div className={`${styles.header} ${visible ? styles.visible : ''}`}>
                    <span className={styles.eyebrow}>Why Zeno</span>
                    <h2 className={styles.heading}>
                        Built on trust.<br />
                        <span className={styles.headingAccent}>Delivered with precision.</span>
                    </h2>
                </div>

                {/* Pillars */}
                <div className={styles.pillars}>
                    {PILLARS.map((pillar, i) => (
                        <div
                            key={pillar.number}
                            className={`${styles.pillar} ${visible ? styles.pillarVisible : ''}`}
                            style={{ transitionDelay: `${0.15 + i * 0.12}s` }}
                        >
                            {/* Top row */}
                            <div className={styles.pillarTop}>
                                <div className={styles.iconWrap}>
                                    {pillar.icon}
                                </div>
                                <span className={styles.pillarNumber}>{pillar.number}</span>
                            </div>

                            {/* Content */}
                            <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                            <p className={styles.pillarBody}>{pillar.body}</p>
                            <p className={styles.pillarDetail}>{pillar.detail}</p>

                            {/* Bottom accent line */}
                            <div className={styles.pillarLine} />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className={`${styles.cta} ${visible ? styles.visible : ''}`}>
                    <p className={styles.ctaText}>Still have questions?</p>

                <a    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.ctaBtn}
                    >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.854L.057 23.882l6.19-1.438A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.498-5.177-1.367l-.369-.214-3.677.854.88-3.574-.234-.38A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    Talk to us on WhatsApp
                </a>
            </div>

        </div>
        </section >
    )
}