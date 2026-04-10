import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
    const navigate = useNavigate()
    const canvasRef = useRef(null)
    const [visible, setVisible] = useState(false)
    const [glitchActive, setGlitchActive] = useState(false)

    // Entrance
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80)
        return () => clearTimeout(t)
    }, [])

    // Random glitch bursts
    useEffect(() => {
        const burst = () => {
            setGlitchActive(true)
            setTimeout(() => setGlitchActive(false), 180)
        }
        const scheduleNext = () => {
            const delay = 2500 + Math.random() * 4000
            return setTimeout(() => {
                burst()
                timer = scheduleNext()
            }, delay)
        }
        let timer = scheduleNext()
        return () => clearTimeout(timer)
    }, [])

    // Canvas — slow bleeding lines
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let raf
        let t = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Generate static horizontal tear lines
        const tears = Array.from({ length: 6 }, () => ({
            y: 0.1 + Math.random() * 0.8,
            width: 0.2 + Math.random() * 0.5,
            x: Math.random() * 0.4,
            speed: 0.0003 + Math.random() * 0.0004,
            offset: Math.random() * Math.PI * 2,
            thickness: 0.5 + Math.random() * 1,
        }))

        const draw = () => {
            const w = canvas.width
            const h = canvas.height
            ctx.clearRect(0, 0, w, h)

            // Horizontal tear lines
            tears.forEach(tear => {
                const opacity = 0.03 + 0.04 * Math.sin(t * tear.speed * 100 + tear.offset)
                const x = tear.x * w
                const width = tear.width * w

                const grad = ctx.createLinearGradient(x, 0, x + width, 0)
                grad.addColorStop(0, 'transparent')
                grad.addColorStop(0.2, `rgba(76,175,118,${opacity})`)
                grad.addColorStop(0.5, `rgba(76,175,118,${opacity * 1.5})`)
                grad.addColorStop(0.8, `rgba(76,175,118,${opacity})`)
                grad.addColorStop(1, 'transparent')

                ctx.beginPath()
                ctx.moveTo(x, tear.y * h)
                ctx.lineTo(x + width, tear.y * h)
                ctx.strokeStyle = grad
                ctx.lineWidth = tear.thickness
                ctx.stroke()
            })

            // Single slow vertical line — like a screen crack
            const crackX = w * 0.72
            const crackOpacity = 0.04 + 0.02 * Math.sin(t * 0.008)
            const crackGrad = ctx.createLinearGradient(0, 0, 0, h)
            crackGrad.addColorStop(0, 'transparent')
            crackGrad.addColorStop(0.3, `rgba(76,175,118,${crackOpacity})`)
            crackGrad.addColorStop(0.7, `rgba(76,175,118,${crackOpacity})`)
            crackGrad.addColorStop(1, 'transparent')

            ctx.beginPath()
            ctx.moveTo(crackX, 0)
            ctx.lineTo(crackX + Math.sin(t * 0.02) * 3, h)
            ctx.strokeStyle = crackGrad
            ctx.lineWidth = 1
            ctx.stroke()

            t++
            raf = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <div className={styles.page}>

            {/* Canvas */}
            <canvas ref={canvasRef} className={styles.canvas} />

            {/* Noise */}
            <div className={styles.noise} aria-hidden="true" />

            {/* ZENO watermark — corrupting */}
            <div
                className={`${styles.watermark} ${glitchActive ? styles.watermarkGlitch : ''}`}
                aria-hidden="true"
            >
                ZENO
            </div>

            {/* Main content */}
            <div className={`${styles.content} ${visible ? styles.contentVisible : ''}`}>

                {/* Top label */}
                <div className={styles.topLabel}>
                    <span className={styles.labelDot} />
                    <span>ZENO.NG — UNHANDLED ROUTE</span>
                </div>

                {/* Error code */}
                <div className={`${styles.errorCode} ${glitchActive ? styles.errorGlitch : ''}`}>
                    <span className={styles.errorNum}>4</span>
                    <span className={`${styles.errorNum} ${styles.errorNumAccent}`}>0</span>
                    <span className={styles.errorNum}>4</span>
                </div>

                {/* Rule */}
                <div className={styles.rule} />

                {/* Message */}
                <div className={styles.messageBlock}>
                    <p className={styles.messageMain}>
                        This page doesn't exist in our catalogue.
                    </p>
                    <p className={styles.messageSub}>
                        The URL you requested could not be resolved.<br />
                        It was never here — or it no longer is.
                    </p>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        className={styles.btnPrimary}
                        onClick={() => navigate('/')}
                    >
                        Return home
                    </button>
                    <button
                        className={styles.btnGhost}
                        onClick={() => navigate('/shop')}
                    >
                        Browse the shop
                    </button>
                </div>

                {/* Bottom system line */}
                <div className={styles.sysLine}>
                    <span>BUILD: ZENO_V1</span>
                    <span className={styles.sysSep} />
                    <span>STATUS: ERR_404</span>
                    <span className={styles.sysSep} />
                    <span>ROUTE: UNRESOLVED</span>
                </div>

            </div>

        </div>
    )
}