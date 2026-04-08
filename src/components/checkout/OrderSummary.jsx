import {useCartStore} from '../../store/cartStore'
import styles from './OrderSummary.module.css'
import { formatPrice } from '../../lib/formatter'

export default function OrderSummary({ shippingData }) {
    const { items, total } = useCartStore()

    return (
        <div className={styles.card}>
            <p className={styles.label}>Order summary</p>

            <div className={styles.itemList}>
                {items.map(item => (
                    <div key={item.id} className={styles.item}>
                        <div className={styles.itemLeft}>
                            <div className={styles.thumb}>
                                <img src={item.images} alt={item.name} />
                                <span className={styles.qty}>{item.quantity}</span>
                            </div>
                            <span className={styles.itemName}>{item.name}</span>
                        </div>
                        <span className={styles.itemPrice}>{item.price}</span>
                    </div>
                ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.row}>
                <span>Subtotal</span>
                <span>{formatPrice(total())}</span>
            </div>
            <div className={styles.row}>
                <span>Delivery</span>
                <span>{shippingData ? 'Calculated' : '—'}</span>
            </div>
            <div className={`${styles.row} ${styles.totalRow}`}>
                <span>Total</span>
                <span className={styles.totalAmount}>{formatPrice(total())}</span>
            </div>
        </div>
    )
}