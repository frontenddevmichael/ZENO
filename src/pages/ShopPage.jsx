import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../lib/utilities/useProducts';
import ProductCard from '../components/products/ProductCard';
import ShopSidebar from './ShopSidebar';
import styles from './ShopPage.module.css';

export default function ShopPage() {
    const [searchParams] = useSearchParams();

    // 1. Extract filters from URL
    const filters = {
        category: searchParams.get('category'),
        min: searchParams.get('min'),
        max: searchParams.get('max'),
        sort: searchParams.get('sort') || 'newest'
    };

    // 2. Feed filters into our "Data Consultant" (the hook)
    const { products, loading, error } = useProducts(filters);

    return (
        <div className={styles.pageWrapper}>
            <aside className={styles.sidebar}>
                <ShopSidebar />
            </aside>

            <main className={styles.resultsArea}>
                <header className={styles.resultsHeader}>
                    <h1>{filters.category || 'All Products'}</h1>
                    <p>{products.length} products found</p>
                </header>

                {/* 3. The Grid Logic */}
                <div className={styles.productGrid}>
                    {loading ? (
                        <p>Loading products...</p> // We'll replace this with Skeletons later
                    ) : error ? (
                        <p className={styles.error}>Error: {error}</p>
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))
                    ) : (
                        <p>No products match your filters.</p>
                    )}
                </div>
            </main>
        </div>
    );
}