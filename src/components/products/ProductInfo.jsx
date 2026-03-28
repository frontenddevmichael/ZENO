import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import styles from './ProductInfo.module.css';

export default function ProductInfo({ product }) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const openCart = useCartStore((state) => state.openCart);

    // Safety check for loading states
    if (!product) return null;

    const handleAddToCart = () => {
        addItem(product, quantity);
        openCart();
    };

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <aside className={styles.infoPanel}>
            <div className={styles.header}>
                <h1 className={styles.title}>{product.name}</h1>
                <p className={styles.price}>₦{product.price?.toLocaleString()}</p>
            </div>

            <p className={styles.description}>
                {product.description_short || "High-performance technology, precisely engineered for the Zeno ecosystem."}
            </p>

            {/* Spec Pills (Optional/Static for now) */}
            <div className={styles.specPills}>
                {product.specs && Object.values(product.specs).slice(0, 3).map((spec, i) => (
                    <span key={i} className={styles.pill}>{spec}</span>
                ))}
            </div>

            <div className={styles.actions}>
                <div className={styles.quantitySelector}>
                    <button onClick={decrement} aria-label="Decrease quantity">−</button>
                    <span>{quantity}</span>
                    <button onClick={increment} aria-label="Increase quantity">+</button>
                </div>

                <button
                    className={styles.addBtn}
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>

            <div className={styles.footer}>
                <a
                    href={`https://wa.me/YOURNUMBER?text=Hi, I'm interested in the ${product.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappLink}
                >
                    Inquire via WhatsApp →
                </a>
            </div>
        </aside>
    );
}