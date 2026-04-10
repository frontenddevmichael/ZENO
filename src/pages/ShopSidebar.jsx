import { useSearchParams } from 'react-router-dom';
import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './ShopSidebar.module.css';
import FilterGroup from './FilterSection';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
    { slug: 'all', label: 'All Products', icon: '◈' },
    { slug: 'phones', label: 'Phones', icon: '◱' },
    { slug: 'laptops', label: 'Laptops', icon: '◰' },
    { slug: 'audio', label: 'Audio', icon: '◲' },
    { slug: 'accessories', label: 'Accessories', icon: '◳' },
    { slug: 'tablets', label: 'Tablets', icon: '◳' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest arrivals' },
    { value: 'price_asc', label: 'Price: low to high' },
    { value: 'price_desc', label: 'Price: high to low' },
    { value: 'popular', label: 'Most popular' },
];

const PRICE_MIN = 0;
const PRICE_MAX = 1_000_000;

// Simulated product distribution — replace with real data from your hook
const HISTOGRAM = [3, 8, 14, 22, 31, 28, 24, 19, 16, 20, 18, 13, 10, 8, 6, 5, 4, 3, 2, 1];

const fmt = (n) => `₦${n.toLocaleString('en-NG')}`;
const fmtK = (n) => n >= 1000 ? `₦${(n / 1000).toFixed(0)}k` : fmt(n);


// ─── Skeleton loader ──────────────────────────────────────────────────────────

export function ShopSidebarSkeleton() {
    return (
        <aside className={styles.sidebar} aria-busy="true" aria-label="Loading filters">
            <div className={styles.skeletonHeader} />
            {[80, 65, 72, 68, 58].map((w, i) => (
                <div key={i} className={styles.skeletonRow} style={{ animationDelay: `${i * 80}ms` }}>
                    <div className={styles.skeletonLine} style={{ width: `${w}%` }} />
                    <div className={styles.skeletonBadge} />
                </div>
            ))}
            <div className={styles.skeletonDivider} />
            <div className={styles.skeletonHistogram}>
                {HISTOGRAM.map((h, i) => (
                    <div
                        key={i}
                        className={styles.skeletonBar}
                        style={{
                            height: `${(h / Math.max(...HISTOGRAM)) * 100}%`,
                            animationDelay: `${i * 40}ms`,
                        }}
                    />
                ))}
            </div>
            <div className={styles.skeletonSlider} />
        </aside>
    );
}


// ─── Dual range slider ────────────────────────────────────────────────────────

function PriceSlider({ low, high, onChange, onCommit }) {
    const trackRef = useRef(null);
    const bucketMax = Math.max(...HISTOGRAM);
    const toPercent = (v) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

    const startDrag = useCallback((handle, e) => {
        e.preventDefault();
        const track = trackRef.current;

        const move = (ev) => {
            const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
            const { left, width } = track.getBoundingClientRect();
            const raw = Math.round(((clientX - left) / width) * (PRICE_MAX - PRICE_MIN) + PRICE_MIN);
            const clamped = Math.max(PRICE_MIN, Math.min(PRICE_MAX, raw));
            if (handle === 'low') onChange(Math.min(clamped, high - 1), high);
            else onChange(low, Math.max(clamped, low + 1));
        };

        const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', up);
            onCommit(); // always fires on release, regardless of where cursor is
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('touchend', up);
    }, [low, high, onChange, onCommit]);

    const lowPct = toPercent(low);
    const highPct = toPercent(high);

    return (
        <div className={styles.sliderRoot}>

            {/* Histogram */}
            <div className={styles.histogram} aria-hidden="true">
                {HISTOGRAM.map((count, i) => {
                    const start = PRICE_MIN + (i / HISTOGRAM.length) * (PRICE_MAX - PRICE_MIN);
                    const end = PRICE_MIN + ((i + 1) / HISTOGRAM.length) * (PRICE_MAX - PRICE_MIN);
                    const active = end > low && start < high;
                    return (
                        <div
                            key={i}
                            className={`${styles.histBar} ${active ? styles.histBarActive : ''}`}
                            style={{ '--h': `${(count / bucketMax) * 100}%` }}
                        />
                    );
                })}
            </div>

            {/* Track */}
            <div className={styles.track} ref={trackRef}>
                <div
                    className={styles.trackFill}
                    style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
                />

                {/* Low handle */}
                <button
                    className={styles.handle}
                    style={{ left: `${lowPct}%` }}
                    onMouseDown={(e) => startDrag('low', e)}
                    onTouchStart={(e) => startDrag('low', e)}
                    role="slider"
                    aria-label="Minimum price"
                    aria-valuenow={low}
                    aria-valuemin={PRICE_MIN}
                    aria-valuemax={high - 1}
                    aria-valuetext={fmt(low)}
                >
                    <span className={styles.handleRing} />
                </button>

                {/* High handle */}
                <button
                    className={styles.handle}
                    style={{ left: `${highPct}%` }}
                    onMouseDown={(e) => startDrag('high', e)}
                    onTouchStart={(e) => startDrag('high', e)}
                    role="slider"
                    aria-label="Maximum price"
                    aria-valuenow={high}
                    aria-valuemin={low + 1}
                    aria-valuemax={PRICE_MAX}
                    aria-valuetext={fmt(high)}
                >
                    <span className={styles.handleRing} />
                </button>
            </div>

            {/* Labels */}
            <div className={styles.priceReadout}>
                <span className={`price ${styles.priceVal}`}>{fmtK(low)}</span>
                <span className={styles.priceSep}>—</span>
                <span className={`price ${styles.priceVal}`}>{fmtK(high)}</span>
            </div>
        </div>
    );
}


// ─── Active filter pills ──────────────────────────────────────────────────────

function FilterPills({ category, low, high, sort, onRemove }) {
    const pills = [];
    if (category && category !== 'all') {
        const c = CATEGORIES.find((x) => x.slug === category);
        pills.push({ key: 'category', label: c?.label ?? category });
    }
    if (low > PRICE_MIN || high < PRICE_MAX) {
        pills.push({ key: 'price', label: `${fmtK(low)} – ${fmtK(high)}` });
    }
    if (sort && sort !== 'newest') {
        const s = SORT_OPTIONS.find((x) => x.value === sort);
        pills.push({ key: 'sort', label: s?.label ?? sort });
    }
    if (!pills.length) return null;

    return (
        <div className={styles.pills} role="list" aria-label="Active filters">
            {pills.map((p) => (
                <button
                    key={p.key}
                    className={styles.pill}
                    onClick={() => onRemove(p.key)}
                    role="listitem"
                    aria-label={`Remove: ${p.label}`}
                >
                    {p.label}
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                        <path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            ))}
        </div>
    );
}


// ─── Main sidebar ─────────────────────────────────────────────────────────────

export default function ShopSidebar({ categoryCounts = {}, loading = false }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentCategory = searchParams.get('category') || 'all';
    const currentSort = searchParams.get('sort') || 'newest';
    const urlMin = Number(searchParams.get('min')) || PRICE_MIN;
    const urlMax = Number(searchParams.get('max')) || PRICE_MAX;

    const [price, setPrice] = useState([urlMin, urlMax]);
    const [hoveredCat, setHoveredCat] = useState(null);

    useEffect(() => { setPrice([urlMin, urlMax]); }, [urlMin, urlMax]);

    if (loading) return <ShopSidebarSkeleton />;

    const update = (changes) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(changes).forEach(([k, v]) =>
            v == null ? next.delete(k) : next.set(k, v)
        );
        setSearchParams(next);
    };

    const handleCategory = (slug) => update({ category: slug === 'all' ? null : slug });
    const handleSort = (value) => update({ sort: value === 'newest' ? null : value });
    const handlePriceCommit = () => {
        update({
            min: price[0] > PRICE_MIN ? price[0] : null,
            max: price[1] < PRICE_MAX ? price[1] : null,
        });
    };
    const removePill = (key) => {
        if (key === 'category') update({ category: null });
        if (key === 'sort') update({ sort: null });
        if (key === 'price') update({ min: null, max: null });
    };
    const clearAll = () => { setSearchParams({}); setPrice([PRICE_MIN, PRICE_MAX]); };

    const hasCat = currentCategory !== 'all';
    const hasPrice = price[0] > PRICE_MIN || price[1] < PRICE_MAX;
    const hasSort = currentSort !== 'newest';
    const hasAny = hasCat || hasPrice || hasSort;

    return (
        <aside className={styles.sidebar} aria-label="Product filters">

            {/* ── Active pills ── */}
            <FilterPills
                category={currentCategory}
                low={price[0]}
                high={price[1]}
                sort={currentSort}
                onRemove={removePill}
            />

            {/* ── Categories ── */}
            <FilterGroup label="Categories" defaultOpen hasActiveFilter={hasCat}>
                <ul className={styles.catList} role="listbox" aria-label="Product categories">
                    {CATEGORIES.map(({ slug, label, icon }) => {
                        const active = currentCategory === slug;
                        const count = categoryCounts[slug] ?? null;
                        return (
                            <li key={slug} role="option" aria-selected={active}>
                                <button
                                    className={`${styles.catBtn} ${active ? styles.catBtnActive : ''}`}
                                    onClick={() => handleCategory(slug)}
                                    onMouseEnter={() => setHoveredCat(slug)}
                                    onMouseLeave={() => setHoveredCat(null)}
                                >
                                    {/* Hover reveal line */}
                                    <span className={styles.catLine} aria-hidden="true" />

                                    <span className={styles.catIcon} aria-hidden="true">{icon}</span>
                                    <span className={styles.catLabel}>{label}</span>

                                    {count != null && (
                                        <span className={`spec-value ${styles.catCount} ${active ? styles.catCountActive : ''}`}>
                                            {count}
                                        </span>
                                    )}

                                    {/* Subtle arrow that slides in on hover */}
                                    <span className={`${styles.catArrow} ${hoveredCat === slug || active ? styles.catArrowVisible : ''}`} aria-hidden="true">
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                            <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </FilterGroup>

            {/* ── Price range ── */}
            <FilterGroup label="Price Range" defaultOpen hasActiveFilter={hasPrice}>
                <PriceSlider
                    low={price[0]}
                    high={price[1]}
                    onChange={(lo, hi) => setPrice([lo, hi])}
                    onCommit={handlePriceCommit}
                />
            </FilterGroup>

            {/* ── Sort ── */}
            <FilterGroup label="Sort By" defaultOpen={false} hasActiveFilter={hasSort}>
                <div className={styles.sortList} role="radiogroup" aria-label="Sort order">
                    {SORT_OPTIONS.map(({ value, label }) => {
                        const active = currentSort === value;
                        return (
                            <button
                                key={value}
                                className={`${styles.sortBtn} ${active ? styles.sortBtnActive : ''}`}
                                onClick={() => handleSort(value)}
                                role="radio"
                                aria-checked={active}
                            >
                                <span className={styles.sortRadio}>
                                    {active && <span className={styles.sortRadioDot} />}
                                </span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </FilterGroup>

            {/* ── Clear ── */}
            {hasAny && (
                <button className={styles.clearBtn} onClick={clearAll}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M1.5 1.5L9.5 9.5M9.5 1.5L1.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Clear all filters
                </button>
            )}
        </aside>
    );
}