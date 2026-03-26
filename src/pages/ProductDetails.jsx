import { useParams } from 'react-router-dom';
import { useProducts } from '../lib/utilities/useProducts';
import { useCartStore } from '../store/cartStore';
import styles from './ProductPage.module.css';

export default function ProductPage() {
    const { slug } = useParams();
    const { product, loading } = useProducts(slug);
    const addItem = useCartStore((state) => state.addItem);

    if (loading) return <div className={styles.loading}>Loading Product...</div>;
    if (!product) return <div className={styles.error}>Product not found.</div>;

    return (
        <main className={styles.container}>
            {/* Left: Image Gallery */}
            <div className={styles.imageSection}>
                <img src={product.image} alt={product.name} className={styles.mainImage} />
            </div>

            {/* Right: Product Info */}
            <div className={styles.infoSection}>
                <span className={styles.category}>{product.category}</span>
                <h1 className={styles.title}>{product.name}</h1>
                <p className={styles.price}>₦{product.price?.toLocaleString()}</p>

                <div className={styles.description}>
                    <p>{product.description || "No description available for this item."}</p>
                </div>

                <button
                    className={styles.addToCart}
                    onClick={() => addItem(product)}
                    disabled={!product.in_stock}
                >
                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </main>
    );
}