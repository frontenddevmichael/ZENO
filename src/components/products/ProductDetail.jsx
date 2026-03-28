import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../../lib/utilities/useDetailProduct';
import ProductGallery from '../products/ProductGallery';
import ProductInfo from '../products/ProductInfo';
import styles from './ProductDetail.module.css';

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.08 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

function ProductSkeleton() {
    return (
        <div className={styles.skeleton}>
            <div className={styles.skeletonBreadcrumb}>
                <div className={`${styles.skeletonLine} ${styles.skeletonCrumb}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonCrumb}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonCrumb}`} />
            </div>
            <div className={styles.skeletonGrid}>
                <div className={styles.skeletonGallery} />
                <div className={styles.skeletonInfo}>
                    <div className={`${styles.skeletonLine} ${styles.skeletonBadge}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonTitle2}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonPrice}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonBody}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonBody2}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonBody3}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonBtn}`} />
                </div>
            </div>
        </div>
    );
}

export default function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { product, loading } = useProduct(slug);
    const [specsRef, specsVisible] = useReveal();

    useEffect(() => {
        if (loading === false && product === null) {
            navigate('/404', { replace: true });
        }
    }, [product, loading, navigate]);

    if (loading) return <ProductSkeleton />;
    if (!product) return null;

    const hasSpecs = product.specs && Object.keys(product.specs).length > 0;

    return (
        <main className={styles.pageWrapper}>

            {/* ── BREADCRUMB ── */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link to="/" className={styles.breadcrumbLink}>Home</Link>
                <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                <Link to="/shop" className={styles.breadcrumbLink}>Shop</Link>
                <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                <span className={styles.breadcrumbCurrent} aria-current="page">
                    {product.name}
                </span>
            </nav>

            {/* ── TWO-COLUMN LAYOUT ── */}
            <div className={styles.container}>
                <section className={styles.galleryColumn} aria-label="Product images">
                    <ProductGallery images={product.images} alt={product.name} />
                </section>

                <section className={styles.infoColumn} aria-label="Product details">
                    <ProductInfo product={product} />
                </section>
            </div>

            {/* ── SPECIFICATIONS ── */}
            {hasSpecs && (
                <section
                    ref={specsRef}  
                    className={`${styles.specs} ${styles.visible}`}
                    aria-label="Product specifications"
                >
                    <div className={styles.specsInner}>

                        <div className={styles.specsHeader}>
                            <span className={styles.specsEyebrow}>Technical data</span>
                            <h2 className={styles.specsHeading}>Specifications.</h2>
                            <p className={styles.specsNote}>
                                Full technical details as provided by the manufacturer.
                                Specifications may vary by region.
                            </p>
                        </div>

                        <div
                            className={styles.specTable}
                            data-product={product.name}
                        >
                            <div className={styles.specGrid}>
                                {Object.entries(product.specs).map(([key, value], index) => (
                                    <div
                                        key={key}
                                        className={styles.specRow}
                                        /* Powers the CSS stagger: transition-delay: calc(var(--i) * 0.055s)
                                           Works for any number of rows — no hardcoded :nth-child limits. */
                                        style={{ '--i': index }}
                                    >
                                        <span className={styles.specKey}>{key}</span>
                                        <span className={styles.specValue}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>
            )}

        </main>
    );
}