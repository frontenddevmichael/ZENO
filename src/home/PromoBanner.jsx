import styles from './PromoBanner.module.css';

export default function PromoBanner() {
    const message = "Free delivery on orders above ₦50,000 within Lagos • Shop the new collection • Limited stock available • ";

    return (
        <div className={styles.bannerContainer}>
            <div className={styles.noiseOverlay}></div>
            <div className={styles.marquee}>
                <div className={styles.track}>
                    {/* We repeat the text to ensure a seamless infinite loop */}
                    <span>{message}</span>
                    <span>{message}</span>
                    <span>{message}</span>
                    <span>{message}</span>
                </div>
            </div>
        </div>
    );
}