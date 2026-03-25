import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUIStore } from '../../../store/uiStore';
import { supabase } from '../../../lib/supabase';
import styles from './searchOverlay.module.css';

// Suggested categories shown before the user types
const SUGGESTED_CATEGORIES = [
    { label: 'Smartphones', path: '/shop?category=smartphones' },
    { label: 'Laptops', path: '/shop?category=laptops' },
    { label: 'Audio', path: '/shop?category=audio' },
    { label: 'Accessories', path: '/shop?category=accessories' },
    { label: 'Tablets', path: '/shop?category=tablets' },
    { label: 'Wearables', path: '/shop?category=wearables' },
];

export default function SearchOverlay() {
    const navigate = useNavigate();
    const isSearchOpen = useUIStore((state) => state.searchOpen);
    const closeSearch = useUIStore((state) => state.closeSearch);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Auto-focus + scroll lock
    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => inputRef.current?.focus(), 60);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setQuery('');
            setResults([]);
        }
    }, [isSearchOpen]);

    // Escape key — re-registers whenever isSearchOpen changes so the
    // listener is only active (and the effect only cleans up) when open.
    useEffect(() => {
        if (!isSearchOpen) return;
        const handleEsc = (e) => { if (e.key === 'Escape') closeSearch(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isSearchOpen, closeSearch]);

    // Debounced Supabase search
    useEffect(() => {
        if (query.trim().length === 0) { setResults([]); return; }

        setLoading(true);
        const id = setTimeout(async () => {
            const { data, error } = await supabase
                .from('products')
                .select('id, name, price, category')
                .ilike('name', `%${query}%`)
                .limit(6);

            if (!error && data) setResults(data);
            setLoading(false);
        }, 280);

        return () => clearTimeout(id);
    }, [query]);

    if (!isSearchOpen) return null;

    const hasQuery = query.trim().length > 0;

    return (
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
        >
            <div
                className={styles.container}
                onClick={(e) => e.stopPropagation()}
            >

                {/* ── TOP BAR ── */}
                <div className={styles.topBar}>
                    <span className={styles.brandMark}>Zeno Search</span>
                    <button
                        className={styles.escHint}
                        onClick={closeSearch}
                        aria-label="Close search"
                    >
                        <span className={styles.escKey}>ESC</span>
                        <span className={styles.escLabel}>to close</span>
                    </button>
                </div>

                {/* ── SEARCH INPUT ── */}
                <div className={`${styles.searchHeader} ${hasQuery ? styles.hasQuery : ''}`}>
                    <svg
                        className={styles.searchIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>

                    <input
                        ref={inputRef}
                        type="search"
                        placeholder="Search products…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={styles.searchInput}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        aria-label="Search products"
                    />
                </div>

                {/* ── RESULTS / SUGGESTIONS AREA ── */}
                <div className={styles.resultsArea}>

                    {/* Pre-search: category chips */}
                    {!hasQuery && (
                        <div className={styles.suggestions}>
                            <p className={styles.suggestionsLabel}>Browse by category</p>
                            <div className={styles.categoryChips}>
                                {SUGGESTED_CATEGORIES.map(({ label, path }) => (
                                    <Link
                                        key={label}
                                        to={path}
                                        className={styles.chip}
                                        onClick={closeSearch}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Loading shimmer */}
                    {loading && (
                        <div>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={styles.shimmerRow}>
                                    <div className={styles.shimmerBlock} style={{ width: '60%' }} />
                                    <div className={styles.shimmerBlock} style={{ width: '15%', marginLeft: 'auto' }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No results */}
                    {!loading && hasQuery && results.length === 0 && (
                        <p className={styles.status}>
                            No results for{' '}
                            <span className={styles.statusQuery}>"{query}"</span>
                        </p>
                    )}

                    {/* Results list */}
                    {!loading && results.length > 0 && (
                        <div className={styles.resultsList}>
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className={styles.resultItem}
                                    onClick={closeSearch}
                                >
                                    <div className={styles.resultInfo}>
                                        <span className={styles.category}>
                                            {product.category}
                                        </span>
                                        <h4 className={styles.resultName}>
                                            {product.name}
                                        </h4>
                                    </div>

                                    <span className={styles.resultPrice}>
                                        ₦{product.price.toLocaleString()}
                                    </span>

                                    <span className={styles.resultArrow} aria-hidden="true">
                                        →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* Click-outside to close */}
            <div
                style={{ position: 'absolute', inset: 0, zIndex: -1 }}
                onClick={closeSearch}
                aria-hidden="true"
            />
        </div>
    );
}