import { useState } from 'react';
import styles from './ShopSidebar.module.css';

export default function FilterGroup({ label, children, defaultOpen = true, hasActiveFilter = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className={styles.filterGroup}
            role="group"
            aria-labelledby={`fg-label-${label}`}
        >
            <button
                id={`fg-label-${label}`}
                className={styles.groupToggle}
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
            >
                <span className={styles.groupLabelRow}>
                    {/* Uses the .label-upper utility class from your global tokens */}
                    <span className={`label-upper ${styles.groupLabel}`}>{label}</span>
                    {hasActiveFilter && (
                        <span className={styles.activeIndicator} aria-label="Active filter" />
                    )}
                </span>
                <svg
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M2.5 4.5L6 8L9.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div
                className={`${styles.groupContent} ${isOpen ? styles.groupContentOpen : ''}`}
                aria-hidden={!isOpen}
            >
                <div className={styles.groupContentInner}>
                    {children}
                </div>
            </div>
        </div>
    );
}