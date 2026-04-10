import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './EditorialStrip.module.css'

const PANELS = [
    {
        number: '01',
        stat: '200MP',
        product: 'Samsung S24 Ultra',
        copy: 'The camera that shoots what your eyes actually see.',
        category: 'phones',
        label: 'Shop Phones',
    },
    {
        number: '02',
        stat: '18hrs',
        product: 'MacBook M2 Air',
        copy: 'All day. No charger. No excuses.',
        category: 'laptops',
        label: 'Shop Laptops',
    },
    {
        number: '03',
        stat: '8 mics',
        product: 'Sony WH-1000XM5',
        copy: 'The world goes quiet. Your music doesn\'t.',
        category: 'audio',
        label: 'Shop Audio',
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
            { threshold: 0.1 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return { ref, visible }
}

export default function EditorialStrip() {
    const navigate = useNavigate()
    const { ref, visible } = useFadeInOnScroll()

    return (
        <section className={styles.section} ref={ref}>
            <div className={styles.inner}>

                {/* Section label */}
                <div className={`${styles.sectionHeader} ${visible ? styles.visible : ''}`}>
                    <span className={styles.sectionLabel}>Why these devices</span>
                    <div className={styles.sectionLine} />
                </div>

                {/* Panels */}
                <div className={styles.panels}>
                    {PANELS.map((panel, i) => (
                        <div
                            key={panel.number}
                            className={`${styles.panel} ${visible ? styles.panelVisible : ''}`}
                            style={{ transitionDelay: `${i * 0.1}s` }}
                            onClick={() => navigate(`/shop?category=${panel.category}`)}
                        >
                            {/* Top row */}
                            <div className={styles.panelTop}>
                                <span className={styles.panelNumber}>{panel.number}</span>
                                <span className={styles.panelStat}>{panel.stat}</span>
                            </div>

                            {/* Divider */}
                            <div className={styles.panelDivider} />

                            {/* Content */}
                            <p className={styles.panelProduct}>{panel.product}</p>
                            <p className={styles.panelCopy}>{panel.copy}</p>

                            {/* CTA */}
                            <div className={styles.panelCta}>
                                <span>{panel.label}</span>
                                <span className={styles.panelArrow}>→</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}