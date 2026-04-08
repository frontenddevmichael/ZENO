import { useParams, useNavigate } from 'react-router-dom'
import styles from './OrderConfirmPage.module.css'

export default function OrderConfirmPage() {
    const { txRef } = useParams()
    const navigate = useNavigate()

    return (
        <div className={styles.page}>
            <div className={styles.card}>

                <div className={styles.iconWrap}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="16" fill="var(--color-accent-light)" />
                        <path
                            d="M9 16l5 5 9-9"
                            stroke="var(--color-accent)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <p className={styles.eyebrow}>Order placed</p>
                <h1 className={styles.orderNumber}>{txRef}</h1>
                <p className={styles.sub}>
                    Payment confirmed. We'll reach out on WhatsApp within 2 hours to arrange delivery.
                </p>

                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepDot} />
                        <div>
                            <p className={styles.stepTitle}>Order received</p>
                            <p className={styles.stepBody}>Your payment has been confirmed</p>
                        </div>
                    </div>
                    <div className={styles.stepLine} />
                    <div className={styles.step}>
                        <div className={`${styles.stepDot} ${styles.pending}`} />
                        <div>
                            <p className={styles.stepTitle}>Processing</p>
                            <p className={styles.stepBody}>We're preparing your order</p>
                        </div>
                    </div>
                    <div className={styles.stepLine} />
                    <div className={styles.step}>
                        <div className={`${styles.stepDot} ${styles.pending}`} />
                        <div>
                            <p className={styles.stepTitle}>Out for delivery</p>
                            <p className={styles.stepBody}>On its way to you</p>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => navigate('/shop')}
                    >
                        Continue shopping
                    </button>

                    <a
                        className={styles.waBtn}
                        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className={styles.waDot} />
                    Message us on WhatsApp
                </a>
            </div>

        </div>
    </div >
  )
}