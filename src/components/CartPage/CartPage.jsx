import {useCartStore} from '../../store/cartStore'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../lib/formatter'
import styles from '../CartPage/CartPage.module.css'

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, images } = useCartStore()
    const navigate = useNavigate()


    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything yet.</p>
                <button onClick={() => navigate('/shop')}>Browse products</button>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.itemList}>
                <h1>Your Cart</h1>
                {items.map(item => (
                    <div key={item.id} className={styles.item}>
                        <img src={item.images} alt={item.name} className={styles.thumbnail} />

                        <div className={styles.itemDetails}>
                            <p className={styles.itemName}>{item.name}</p>
                            <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                        </div>

                        <div className={styles.quantityControls}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>

                        <button
                            className={styles.removeBtn}
                            onClick={() => removeItem(item.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className={styles.summary}>
                <div className={styles.summaryCard}>
                    <h2>Order Summary</h2>

                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>{formatPrice(total())}</span>
                    </div>

                    <div className={styles.summaryRow}>
                        <strong>Total</strong>
                        <strong>{formatPrice(total())}</strong>
                    </div>

                    <button
                        className={styles.checkoutBtn}
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to checkout
                    </button>
                </div>
            </div>
        </div>
    )
}