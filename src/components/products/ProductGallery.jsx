import { useState, useCallback, useEffect, useRef } from "react";
import styles from "./ProductGallery.module.css";


export default function ProductGallery({
    images,
    alt = "Product",
    aspectRatio = "1 / 1",
}) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const mainRef = useRef(null);

    // Close lightbox on Escape
    useEffect(() => {
        if (!lightboxOpen) return;
        const handler = (e) => {
            if (e.key === "Escape") setLightboxOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [lightboxOpen]);


    useEffect(() => {
        document.body.style.overflow = lightboxOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [lightboxOpen]);

    const handleMouseMove = useCallback((e) => {
        if (!mainRef.current) return;
        const rect = mainRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
        });
    }, []);

    // No image provided
    if (!images) {
        return (
            <div className={styles.placeholder} aria-label="No product image available">
                <span className={styles.placeholderIcon} aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </span>
                <span className={styles.placeholderText}>No image</span>
            </div>
        );
    }

    return (
        <>
            {/* ── Main viewer ── */}
            <div
                className={`${styles.mainImageWrapper} ${isZoomed ? styles.zoomed : ""}`}
                style={{ aspectRatio }}
                ref={mainRef}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                onClick={() => !imageFailed && setLightboxOpen(true)}
                role="button"
                tabIndex={0}
                aria-label={`View ${alt} in full screen`}
                onKeyDown={(e) => e.key === "Enter" && !imageFailed && setLightboxOpen(true)}
            >
                {/* Skeleton shimmer while loading */}
                {!imageLoaded && !imageFailed && (
                    <div className={styles.shimmer} aria-hidden="true" />
                )}

                {imageFailed ? (
                    <div className={styles.errorState} aria-label="Image failed to load">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <span>Failed to load</span>
                    </div>
                ) : (
                    <img
                        src={images}
                        alt={alt}
                        className={`${styles.mainImage} ${imageLoaded ? styles.imageVisible : ""}`}
                        style={
                            isZoomed
                                ? {
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                    transform: "scale(2.2)",
                                }
                                : {}
                        }
                        onLoad={() => setImageLoaded(true)}
                        onError={() => { setImageFailed(true); setImageLoaded(true); }}
                        draggable={false}
                    />
                )}

                {/* Zoom hint — only shown after image is loaded */}
                {imageLoaded && !imageFailed && (
                    <div className={styles.zoomHint} aria-hidden="true">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        Zoom
                    </div>
                )}
            </div>

            {/* ── Lightbox ── */}
            {lightboxOpen && (
                <div
                    className={styles.lightboxOverlay}
                    onClick={() => setLightboxOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${alt} — fullscreen view`}
                >
                    <div
                        className={styles.lightboxContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images}
                            alt={`${alt} — fullscreen`}
                            className={styles.lightboxImage}
                            draggable={false}
                        />
                    </div>

                    <button
                        className={styles.lightboxClose}
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Close fullscreen view"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}