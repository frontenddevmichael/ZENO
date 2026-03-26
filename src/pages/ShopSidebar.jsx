import { useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ShopSidebar.module.css';
import FilterGroup from './FilterSection';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
    { slug: 'all', label: 'All Products' },
    { slug: 'phones', label: 'Phones' },
    { slug: 'laptops', label: 'Laptops' },
    { slug: 'audio', label: 'Audio' },
    { slug: 'accessories', label: 'Accessories' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'popular', label: 'Most Popular' },
];

// Price axis: ₦0 – ₦1,000,000
const PRICE_MIN = 0;
const PRICE_MAX = 1_000_000;

// Simulated histogram buckets (20 bars across the price range).
// In a real app, derive these from your product data.
const HISTOGRAM_BUCKETS = [
    3, 8, 14, 22, 31, 28, 24, 19, 16, 20,
    18, 13, 10, 8, 6, 5, 4, 3, 2, 1,
];


// ─── Dual-range slider ────────────────────────────────────────────────────────

function DualRangeSlider({ min, max, low, high, onChange }) {
    const trackRef = useRef(null);

    // Convert a price value → percentage position on the track
    const toPercent = (val) => ((val - min) / (max - min)) * 100;

    // Dragging logic — works for both handles
    const startDrag = useCallback((handle, e) => {
        e.preventDefault();
        const track = trackRef.current;

        const move = (evt) => {
            const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
            const { left, width } = track.getBoundingClientRect();
            const raw = Math.round(((clientX - left) / width) * (max - min) + min);
            const clamped = Math.max(min, Math.min(max, raw));

            if (handle === 'low') {
                onChange(Math.min(clamped, high - 1), high);
            } else {
                onChange(low, Math.max(clamped, low + 1));
            }
        };

        const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', up);
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('touchend', up);
    }, [min, max, low, high, onChange]);

    const lowPct = toPercent(low);
    const highPct = toPercent(high);

    const bucketMax = Math.max(...HISTOGRAM_BUCKETS);

    return (
        <div className={styles.sliderWrapper}>
            {/* Histogram */}
            <div className={styles.histogram} aria-hidden="true">
                {HISTOGRAM_BUCKETS.map((count, i) => {
                    const bucketStart = min + (i / HISTOGRAM_BUCKETS.length) * (max - min);
                    const bucketEnd = min + ((i + 1) / HISTOGRAM_BUCKETS.length) * (max - min);
                    const inRange = bucketEnd > low && bucketStart < high;
                    return (
                        <div
                            key={i}
                            className={`${styles.histBar} ${inRange ? styles.histBarActive : ''}`}
                            style={{ height: `${(count / bucketMax) * 100}%` }}
                        />
                    );
                })}
            </div>

            {/* Track */}
            <div className={styles.track} ref={trackRef}>
                {/* Filled range */}
                <div
                    className={styles.trackRange}
                    style={{
                        left: `${lowPct}%`,
                        width: `${highPct - lowPct}%`,
                    }}
                />

                {/* Low handle */}
                <button
                    className={styles.handle}
                    style={{ left: `${lowPct}%` }}
                    onMouseDown={(e) => startDrag('low', e)}
                    onTouchStart={(e) => startDrag('low', e)}
                    role="slider"
                    aria-label="Minimum price"
                    aria-valuemin={min}
                    aria-valuemax={high - 1}
                    aria-valuenow={low}
                    aria-valuetext={`₦${low.toLocaleString()}`}
                />

                {/* High handle */}
                <button
                    className={styles.handle}
                    style={{ left: `${highPct}%` }}
                    onMouseDown={(e) => startDrag('high', e)}
                    onTouchStart={(e) => startDrag('high', e)}
                    role="slider"
                    aria-label="Maximum price"
                    aria-valuemin={low + 1}
                    aria-valuemax={max}
                    aria-valuenow={high}
                    aria-valuetext={`₦${high.toLocaleString()}`}
                />
            </div>

            {/* Price labels */}
            <div className={styles.priceLabels}>
                <span className={`price ${styles.priceLabel}`}>
                    ₦{low.toLocaleString()}
                </span>
                <span className={`price ${styles.priceLabel}`}>
                    ₦{high.toLocaleString()}
                </span>
            </div>
        </div>
    );
}


// ─── Active filter pills ──────────────────────────────────────────────────────

function ActiveFilterPills({ category, minPrice, maxPrice, sort, onRemove }) {
    const pills = [];

    if (category && category !== 'all') {
        const cat = CATEGORIES.find(c => c.slug === category);
        pills.push({ key: 'category', label: cat?.label ?? category });
    }

    if (minPrice > PRICE_MIN || maxPrice < PRICE_MAX) {
        pills.push({
            key: 'price',
            label: `₦${(minPrice / 1000).toFixed(0)}k – ₦${(maxPrice / 1000).toFixed(0)}k`,
        });
    }

    if (sort && sort !== 'newest') {
        const s = SORT_OPTIONS.find(o => o.value === sort);
        pills.push({ key: 'sort', label: s?.label ?? sort });
    }

    if (pills.length === 0) return null;

    return (
        <div className={styles.activePills} role="list" aria-label="Active filters">
            {pills.map(pill => (
                <button
                    key={pill.key}
                    className={styles.pill}
                    onClick={() => onRemove(pill.key)}
                    role="listitem"
                    aria-label={`Remove filter: ${pill.label}`}
                >
                    {pill.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            ))}
        </div>
    );
}


// ─── Main sidebar ─────────────────────────────────────────────────────────────

export default function ShopSidebar({ categoryCounts = {} }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentCategory = searchParams.get('category') || 'all';
    const currentSort = searchParams.get('sort') || 'newest';
    const paramMin = Number(searchParams.get('min')) || PRICE_MIN;
    const paramMax = Number(searchParams.get('max')) || PRICE_MAX;

    // Local slider state — only written to URL on mouse-up (via the handler)
    const [priceRange, setPriceRange] = useState([paramMin, paramMax]);

    // Sync local state if URL changes externally (e.g. browser back)
    useEffect(() => {
        setPriceRange([paramMin, paramMax]);
    }, [paramMin, paramMax]);

    // ── Helpers ──────────────────────────────────────────────────────────────

    const updateParams = (updates) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, val]) => {
            if (val === null || val === undefined) {
                next.delete(key);
            } else {
                next.set(key, val);
            }
        });
        setSearchParams(next);
    };

    const handleCategoryChange = (slug) => {
        updateParams({ category: slug === 'all' ? null : slug });
    };

    const handleSortChange = (e) => {
        updateParams({ sort: e.target.value === 'newest' ? null : e.target.value });
    };

    // Slider fires on every drag move — updates local state only
    const handlePriceChange = useCallback((low, high) => {
        setPriceRange([low, high]);
    }, []);

    // Apply price to URL when user releases handle
    const handlePriceCommit = useCallback(() => {
        const [low, high] = priceRange;
        updateParams({
            min: low > PRICE_MIN ? low : null,
            max: high < PRICE_MAX ? high : null,
        });
    }, [priceRange]);

    // Remove individual active filters
    const handleRemovePill = (key) => {
        if (key === 'category') updateParams({ category: null });
        if (key === 'sort') updateParams({ sort: null });
        if (key === 'price') updateParams({ min: null, max: null });
    };

    const clearAll = () => {
        setSearchParams({});
        setPriceRange([PRICE_MIN, PRICE_MAX]);
    };

    const hasPriceFilter = priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX;
    const hasCategoryFilter = currentCategory !== 'all';
    const hasSortFilter = currentSort !== 'newest';
    const hasAnyFilter = hasPriceFilter || hasCategoryFilter || hasSortFilter;

    return (
        <aside className={styles.sidebar} aria-label="Product filters">

            {/* Active filter pills */}
            <ActiveFilterPills
                category={currentCategory}
                minPrice={priceRange[0]}
                maxPrice={priceRange[1]}
                sort={currentSort}
                onRemove={handleRemovePill}
            />

            {/* Categories */}
            <FilterGroup
                label="Categories"
                defaultOpen
                hasActiveFilter={hasCategoryFilter}
            >
                <ul className={styles.categoryList} role="listbox" aria-label="Product categories">
                    {CATEGORIES.map(({ slug, label }) => {
                        const count = categoryCounts[slug] ?? null;
                        const isActive = currentCategory === slug;
                        return (
                            <li key={slug} role="option" aria-selected={isActive}>
                                <button
                                    className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                                    onClick={() => handleCategoryChange(slug)}
                                >
                                    <span className={styles.filterBtnLabel}>{label}</span>
                                    {count !== null && (
                                        <span className={`spec-value ${styles.categoryCount}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </FilterGroup>

            {/* Price Range */}
            <FilterGroup
                label="Price Range"
                defaultOpen
                hasActiveFilter={hasPriceFilter}
            >
                <div
                    onMouseUp={handlePriceCommit}
                    onTouchEnd={handlePriceCommit}
                >
                    <DualRangeSlider
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        low={priceRange[0]}
                        high={priceRange[1]}
                        onChange={handlePriceChange}
                    />
                </div>
            </FilterGroup>

            {/* Sort */}
            <FilterGroup
                label="Sort By"
                defaultOpen={false}
                hasActiveFilter={hasSortFilter}
            >
                <div className={styles.sortOptions} role="radiogroup" aria-label="Sort order">
                    {SORT_OPTIONS.map(({ value, label }) => {
                        const isActive = currentSort === value;
                        return (
                            <button
                                key={value}
                                className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                                onClick={() => handleSortChange({ target: { value } })}
                                role="radio"
                                aria-checked={isActive}
                            >
                                <span className={styles.filterBtnLabel}>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </FilterGroup>

            {/* Clear all */}
            {hasAnyFilter && (
                <button className={styles.clearBtn} onClick={clearAll}>
                    Clear all filters
                </button>
            )}
        </aside>
    );
}