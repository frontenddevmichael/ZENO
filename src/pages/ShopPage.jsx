import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../lib/utilities/useProducts';
import ProductCard from '../components/products/ProductCard';
import ShopSidebar, { ShopSidebarSkeleton } from './ShopSidebar';
import styles from './ShopPage.module.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const SKELETON_COUNT = 6;

const VIEW_MODES = [
    {
        id: 'grid',
        label: 'Grid view',
        icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            </svg>
        ),
    },
    {
        id: 'list',
        label: 'List view',
        icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="1" y="1.5" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="1" y="5.5" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="1" y="9.5" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
            </svg>
        ),
    },
];

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ index, viewMode }) {
    return (
        <div
            className={`${styles.skeletonCard} ${viewMode === 'list' ? styles.skeletonCardList : ''}`}
            style={{ animationDelay: `${index * 20}ms` }}
            aria-hidden="true"
        >
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonBody}>
                <div className={styles.skeletonLine} style={{ width: '45%', height: '10px' }} />
                <div className={styles.skeletonLine} style={{ width: '80%', height: '14px', marginTop: '6px' }} />
                <div className={styles.skeletonLine} style={{ width: '60%', height: '12px', marginTop: '4px' }} />
                <div className={styles.skeletonFooter}>
                    <div className={styles.skeletonLine} style={{ width: '38%', height: '16px' }} />
                    <div className={styles.skeletonBtn} />
                </div>
            </div>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filters, onClear }) {
    const hasFilters =
        filters.category || filters.min || filters.max ||
        (filters.sort && filters.sort !== 'newest');

    return (
        <div className={styles.emptyState}>
            {/* Abstract geometric illustration */}
            <div className={styles.emptyIllustration} aria-hidden="true">
                <div className={styles.emptyRing} />
                <div className={styles.emptyRingInner} />
                <svg
                    className={styles.emptyIcon}
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                >
                    <path
                        d="M6 8h16M6 14h10M6 20h7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <circle cx="21" cy="19" r="5" stroke="currentColor" strokeWidth="1.5" />
                    <path
                        d="M24.5 22.5L27 25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <h3 className={styles.emptyTitle}>
                {hasFilters ? 'No products match these filters' : 'No products yet'}
            </h3>
            <p className={styles.emptyDesc}>
                {hasFilters
                    ? 'Try adjusting your filters — or clear them to see everything.'
                    : 'Check back soon, new products are added regularly.'}
            </p>

            {hasFilters && (
                <div className={styles.emptyActions}>
                    {filters.category && (
                        <span className={styles.emptyFilterTag}>
                            Category: {filters.category}
                        </span>
                    )}
                    {(filters.min || filters.max) && (
                        <span className={styles.emptyFilterTag}>
                            Price filter active
                        </span>
                    )}
                    <button className={styles.emptyClearBtn} onClick={onClear}>
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }) {
    return (
        <div className={styles.errorState}>
            <div className={styles.errorDot} aria-hidden="true" />
            <p className={styles.errorTitle}>Couldn't load products</p>
            <p className={styles.errorDesc}>Something went wrong on our end. It's not you.</p>
            <button className={styles.retryBtn} onClick={onRetry}>
                Try again
            </button>
        </div>
    );
}

// ─── Sticky results bar ───────────────────────────────────────────────────────

function StickyBar({ count, category, loading, viewMode, onViewChange, filterPillsRef }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const pills = filterPillsRef?.current;
        if (!pills) return;
        const obs = new IntersectionObserver(
            ([entry]) => setVisible(!entry.isIntersecting),
            { threshold: 0 }
        );
        obs.observe(pills);
        return () => obs.disconnect();
    }, [filterPillsRef]);

    return (
        <div className={`${styles.stickyBar} ${visible ? styles.stickyBarVisible : ''}`} aria-hidden={!visible}>
            <span className={styles.stickyCount}>
                {loading ? '—' : `${count} product${count !== 1 ? 's' : ''}`}
                {category && category !== 'all' && (
                    <span className={styles.stickyCategory}> in {category}</span>
                )}
            </span>
        </div>
    );
}

// ─── Mobile filter trigger ────────────────────────────────────────────────────

function MobileFilterBtn({ count, onClick }) {
    return (
        <button className={styles.mobileFilterBtn} onClick={onClick} aria-haspopup="dialog">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Filters
            {count > 0 && (
                <span className={styles.mobileFilterCount}>{count}</span>
            )}
        </button>
    );
}

// ─── Mobile bottom sheet ──────────────────────────────────────────────────────

function BottomSheet({ open, onClose, children }) {
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);
    if (!open) return null;
    return (
        <>
            <div
                className={`${styles.sheetBackdrop} ${open ? styles.sheetBackdropVisible : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Product filters"
            >
                {/* Drag handle */}
                <div className={styles.sheetHandle} aria-hidden="true" />
                <div className={styles.sheetHeader}>
                    <span className={`label-upper ${styles.sheetTitle}`}>Filters</span>
                    <button className={styles.sheetClose} onClick={onClose} aria-label="Close filters">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className={styles.sheetBody}>{children}</div>
            </div>
        </>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('grid');
    const [sheetOpen, setSheetOpen] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const filterPillsRef = useRef(null);

    const filters = {
        category: searchParams.get('category'),
        min: searchParams.get('min'),
        max: searchParams.get('max'),
        sort: searchParams.get('sort') || 'newest',
    };

    const { products, loading, error } = useProducts(filters, retryKey);

    // Count active filters for mobile badge
    const activeFilterCount = [
        filters.category,
        filters.min || filters.max,
        filters.sort !== 'newest' ? filters.sort : null,
    ].filter(Boolean).length;

    const clearAll = () => setSearchParams({});

    // Category counts — in a real app derive from your data layer
    // Shape: { all: 42, phones: 12, laptops: 8, audio: 9, accessories: 13 }
    const categoryCounts = {};

    const displayTitle = filters.category
        ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
        : 'All Products';

    return (
        <div className={styles.pageWrapper}>

            {/* ── Sticky results bar (appears after scrolling past header) ── */}
            <StickyBar
                count={products.length}
                category={filters.category}
                loading={loading}
                viewMode={viewMode}
                onViewChange={setViewMode}
                filterPillsRef={filterPillsRef}
            />

            {/* ── Desktop sidebar ── */}
            <aside className={styles.sidebarCol}>
                {loading
                    ? <ShopSidebarSkeleton />
                    : <ShopSidebar categoryCounts={categoryCounts} />
                }
            </aside>

            {/* ── Main results column ── */}
            <main className={styles.resultsCol}>

                {/* Results header */}
                <header className={styles.resultsHeader} ref={filterPillsRef}>
                    <div className={styles.headerTop}>
                        <div>
                            <h1 className={styles.resultsTitle}>{displayTitle}</h1>
                            <p className={styles.resultsCount}>
                                {loading
                                    ? <span className={styles.countSkeleton} />
                                    : <><span className="price">{products.length}</span> products found</>
                                }
                            </p>
                        </div>

                        {/* Desktop view toggle */}
                        <div className={styles.headerControls}>
                        </div>
                    </div>
                </header>

                {/* Mobile filter trigger */}
                <div className={styles.mobileBar}>
                    <MobileFilterBtn
                        count={activeFilterCount}
                        onClick={() => setSheetOpen(true)}
                    />
                </div>

                {/* ── Grid / list / states ── */}
                {loading ? (
                    <div
                        className={`${styles.productGrid} ${viewMode === 'list' ? styles.productList : ''}`}
                        aria-busy="true"
                        aria-label="Loading products"
                    >
                        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <SkeletonCard key={i} index={i} viewMode={viewMode} />
                        ))}
                    </div>
                ) : error ? (
                    <ErrorState onRetry={() => setRetryKey((k) => k + 1)} />
                ) : products.length > 0 ? (
                    <div
                        className={`${styles.productGrid} ${viewMode === 'list' ? styles.productList : ''}`}
                        role="list"
                        aria-label={`${products.length} products`}
                    >
                        {products.map((product, i) => (
                            <div
                                key={product.id}
                                role="listitem"
                                className={styles.productItem}
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <ProductCard {...product} viewMode={viewMode} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState filters={filters} onClear={clearAll} />
                )}
            </main>

            {/* ── Mobile bottom sheet ── */}
            <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
                <ShopSidebar categoryCounts={categoryCounts} />
            </BottomSheet>
        </div>
    );
}