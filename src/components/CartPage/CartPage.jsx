import {useCartStore} from '../../store/cartStore'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../lib/formatter'  
import styles from './CartPage.module.css'
import { useState } from 'react'

const FREE_DELIVERY_THRESHOLD = 500000

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCartStore()
    const navigate = useNavigate()
    const [removingIds, setRemovingIds] = useState([])

    const handleRemove = (id) => {
        setRemovingIds(prev => [...prev, id])
        setTimeout(() => removeItem(id), 350)
    }

    const subtotal = total()
    const remaining = FREE_DELIVERY_THRESHOLD - subtotal
    const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)

    if (items.length === 0) {
        return (
            <div className={styles.emptyPage}>
                <div className={styles.emptyState}>
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                        <circle cx="36" cy="36" r="36" fill="var(--color-bg-subtle)" />
                        <path d="M22 26h4l3 14h18l3-10H27" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="31" cy="43" r="1.5" fill="var(--color-text-secondary)" />
                        <circle cx="43" cy="43" r="1.5" fill="var(--color-text-secondary)" />
                        <path d="M36 20v6M33 22l3-2 3 2" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
                    </svg>
                    <h2 className={styles.emptyHeading}>Nothing here yet</h2>
                    <p className={styles.emptyBody}>Your cart is empty. Time to fix that.</p>
                    <button className={styles.shopBtn} onClick={() => navigate('/shop')}>
                        Browse products
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.colLeft}>
                <h1 className={styles.heading}>Your cart</h1>

                {items.map(item => (
                    <div
                        key={item.id}
                        className={`${styles.item} ${removingIds.includes(item.id) ? styles.removing : ''}`}
                    >
                        <div className={styles.thumb}>
                            <img src={item.images} alt={item.name} />
                        </div>

                        <div className={styles.itemMeta}>
                            <p className={styles.itemName}>{item.name}</p>
                        </div>

                        <p className={styles.itemPrice}>{formatPrice(item.price)}</p>

                        <div className={styles.qty}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>

                        <button
                            className={styles.removeBtn}
                            onClick={() => handleRemove(item.id)}
                            aria-label="Remove item"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.summaryCol}>
                <div className={styles.summaryCard}>
                    <p className={styles.summaryLabel}>Order summary</p>

                    <div className={styles.sRow}>
                        <span>Subtotal</span>
                        <span className={styles.mono}>{formatPrice(subtotal)}</span>
                    </div>
                    <div className={styles.sRow}>
                        <span>Delivery</span>
                        <span className={styles.free}>
                            {remaining <= 0 ? 'Free' : 'Calculated at checkout'}
                        </span>
                    </div>
                    <div className={`${styles.sRow} ${styles.totalRow}`}>
                        <span>Total</span>
                        <span className={styles.totalAmount}>{formatPrice(subtotal)}</span>
                    </div>

                    <div className={styles.deliveryBar}>
                        <div className={styles.deliveryBarLabels}>
                            <span>Free delivery progress</span>
                            <span>{formatPrice(subtotal)} / ₦500,000</span>
                        </div>
                        <div className={styles.barTrack}>
                            <div className={styles.barFill} style={{ width: `${progress}%` }} />
                        </div>
                        <p className={styles.deliveryTip}>
                            {remaining <= 0
                                ? <><strong>Free delivery unlocked</strong> — Lagos same day</>
                                : <>Add <strong>{formatPrice(remaining)}</strong> more for free delivery</>
                            }
                        </p>
                    </div>

                    <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                        Proceed to checkout →
                    </button>

                    <div className={styles.waLink}>
                        <span className={styles.waDot} />
                        <span>Or enquire via WhatsApp</span>
                    </div>
                </div>
            </div>
        </div>
    )
}