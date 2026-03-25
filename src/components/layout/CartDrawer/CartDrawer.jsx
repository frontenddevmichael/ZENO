import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
    const navigate = useNavigate();

    const items = useCartStore((state) => state.items);
    const isOpen = useCartStore((state) => state.isOpen);
    const closeCart = useCartStore((state) => state.closeCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    // const total = useCartStore((state) => state.totalPrice());

    // Escape key + scroll lock
    useEffect(() => {
        const handleEscape = (e) => { if (e.key === 'Escape') closeCart(); };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, closeCart]);

    const handleViewCart = () => {
        closeCart();
        navigate('/cart');
    };

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <>
            {/* ── OVERLAY ── */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* ── DRAWER ── */}
            <aside
                className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
                aria-label="Shopping cart"
                aria-modal="true"
                role="dialog"
            >

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h3>Cart</h3>
                        {itemCount > 0 && (
                            <span className={styles.itemCount}>
                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className={styles.closeBtn}
                        aria-label="Close cart"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.75"
                            strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {items.length === 0 ? (

                        /* ── Empty state ── */
                        <div className={styles.empty}>
                            <svg className={styles.emptyIcon} viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <p className={styles.emptyTitle}>Your cart is empty</p>
                            <p className={styles.emptySubtext}>
                                Add something worth owning.
                            </p>
                            <Link
                                to="/shop"
                                onClick={closeCart}
                                className={styles.shopLink}
                            >
                                Browse the shop →
                            </Link>
                        </div>

                    ) : (

                        /* ── Item list ── */
                        <div className={styles.itemList}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.item}>

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={styles.thumb}
                                    />

                                    <div className={styles.itemInfo}>
                                        <p className={styles.itemName}>{item.name}</p>
                                        <p className={styles.itemPrice}>
                                            ₦{item.price.toLocaleString()}
                                        </p>

                                        <div className={styles.itemFooter}>

                                            {/* Qty stepper */}
                                            <div className={styles.qtyControls}>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() =>
                                                        item.quantity > 1
                                                            ? updateQuantity(item.id, item.quantity - 1)
                                                            : removeItem(item.id)
                                                    }
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className={styles.qtyDivider} aria-hidden="true" />
                                                <span className={styles.qtyValue}>{item.quantity}</span>
                                                <span className={styles.qtyDivider} aria-hidden="true" />
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                className={styles.removeBtn}
                                                onClick={() => removeItem(item.id)}
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                Remove
                                            </button>

                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer — only when cart has items */}
                {items.length > 0 && (
                    <div className={styles.footer}>

                        <div className={styles.subtotal}>
                            <span className={styles.subtotalLabel}>Subtotal</span>
                            <span className={styles.subtotalValue}>
                                ₦{total.toLocaleString()}
                            </span>
                        </div>

                        <p className={styles.shippingNote}>
                            Shipping calculated at checkout
                        </p>

                        <button
                            className={styles.checkoutBtn}
                            onClick={handleViewCart}
                        >
                            <span>View Cart</span>
                        </button>

                    </div>
                )}

            </aside>
        </>
    );
}