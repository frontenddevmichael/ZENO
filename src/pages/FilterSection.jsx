import { useState } from 'react';
import styles from './ShopSidebar.module.css';

export default function FilterGroup({
    label,
    children,
    defaultOpen = true,
    hasActiveFilter = false,
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const id = `fg-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className={`${styles.filterGroup} ${isOpen ? styles.filterGroupOpen : ''}`}>
            <button
                id={id}
                className={styles.groupToggle}
                onClick={() => setIsOpen((p) => !p)}
                aria-expanded={isOpen}
            >
                <span className={styles.groupLabelRow}>
                    <span className={`label-upper ${styles.groupLabel}`}>{label}</span>
                    {hasActiveFilter && (
                        <span className={styles.activeDot} aria-label="Active filter" />
                    )}
                </span>

                {/* Animated chevron */}
                <span className={`${styles.chevronWrap} ${isOpen ? styles.chevronOpen : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                            d="M2.5 4.5L6 8L9.5 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </button>

            <div className={`${styles.groupBody} ${isOpen ? styles.groupBodyOpen : ''}`}>
                <div className={styles.groupBodyInner}>{children}</div>
            </div>
        </div>
    );
}