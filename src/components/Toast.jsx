import { useEffect } from 'react'
import styles from './Toast.module.css'

export default function Toast({ message, type = 'error', description, action, onDismiss, duration = 4000 }) {
    useEffect(() => {
        if (!message) return
        const timer = setTimeout(onDismiss, duration)
        return () => clearTimeout(timer)
    }, [message, duration, onDismiss])

    if (!message) return null

    const eyebrow = {
        success: "You're in",
        error: 'Something went wrong',
        warning: 'Hold on',
        info: 'Heads up',
    }[type]

    return (
        <div className={`${styles.toast} ${styles[type]}`} role="alert">
            <div className={styles.dot} />
            <div className={styles.body}>
                <span className={styles.eyebrow}>{eyebrow}</span>
                <p className={styles.title}>{message}</p>
                {description && <p className={styles.desc}>{description}</p>}
            </div>
            <div className={styles.right}>
                {action && (
                    <button onClick={action.onClick} className={styles.action}>
                        {action.label}
                    </button>
                )}
                <div className={styles.divider} />
                <button onClick={onDismiss} className={styles.close} aria-label="Dismiss">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
            <div className={styles.progress} />
        </div>
    )
}