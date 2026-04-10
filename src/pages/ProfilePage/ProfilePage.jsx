import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { getOrdersByUser } from '../../lib/utilities/query'
import { formatPrice } from '../../lib/formatter'
import styles from './ProfilePage.module.css'

const TABS = ['My Orders', 'Personal Info']
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

// ── Helper: time-based greeting ────────────────────────────
function getGreeting(firstName, orderCount) {
    const hour = new Date().getHours()
    const time = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

    if (orderCount === 0) {
        return `Good ${time}, ${firstName}. Ready to find something?`
    }
    if (orderCount === 1) {
        return `Good ${time}, ${firstName}. You've made 1 order with us.`
    }
    return `Good ${time}, ${firstName}. You've made ${orderCount} orders with us.`
}

// ── Helper: total spent ────────────────────────────────────
function getTotalSpent(orders) {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0)
}

// ── Helper: member since ───────────────────────────────────
function getMemberSince(user) {
    return new Date(user.created_at).toLocaleDateString('en-NG', {
        month: 'long',
        year: 'numeric'
    })
}

export default function ProfilePage() {
    const profile = useAuthStore(state => state.profile)
    const user = useAuthStore(state => state.user)
    const [activeTab, setActiveTab] = useState('My Orders')
    const [orders, setOrders] = useState([])
    const [loadingOrders, setLoadingOrders] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await getOrdersByUser()
                setOrders(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoadingOrders(false)
            }
        }
        fetchOrders()
    }, [])

    const firstName = profile.fullName.split(' ')[0]
    const lastOrder = orders[0] || null

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Page header */}
                <div className={styles.pageHeader}>
                    <div className={styles.avatar}>
                        {profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className={styles.name}>{profile.fullName}</h1>
                        <p className={styles.email}>{profile.email}</p>
                    </div>
                </div>

                {/* ── Feature 3: Contextual greeting ── */}
                {!loadingOrders && (
                    <p className={styles.greeting}>
                        {getGreeting(firstName, orders.length)}
                    </p>
                )}

                {/* ── Feature 1: Stats strip ── */}
                {!loadingOrders && (
                    <div className={styles.statsStrip}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{orders.length}</span>
                            <span className={styles.statLabel}>Orders</span>
                        </div>
                        <div className={styles.statDivider} />
                        <div className={styles.stat}>
                            <span className={styles.statValue}>
                                {formatPrice(getTotalSpent(orders))}
                            </span>
                            <span className={styles.statLabel}>Total spent</span>
                        </div>
                        <div className={styles.statDivider} />
                        <div className={styles.stat}>
                            <span className={styles.statValue}>
                                {getMemberSince(user)}
                            </span>
                            <span className={styles.statLabel}>Member since</span>
                        </div>
                    </div>
                )}

                {/* ── Feature 4: Last order highlight ── */}
                {!loadingOrders && lastOrder && (
                    <div className={styles.lastOrderCard}>
                        <div className={styles.lastOrderHeader}>
                            <span className={styles.lastOrderLabel}>Your last order</span>
                            <span className={`${styles.statusBadge} ${styles[lastOrder.status]}`}>
                                {lastOrder.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className={styles.lastOrderBody}>
                            <p className={styles.lastOrderNumber}>{lastOrder.order_number}</p>
                            <p className={styles.lastOrderDate}>
                                {new Date(lastOrder.created_at).toLocaleDateString('en-NG', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                            <p className={styles.lastOrderTotal}>
                                {formatPrice(lastOrder.total)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className={styles.tabs}>
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className={styles.tabContent}>
                    {activeTab === 'My Orders' && (
                        <OrdersTab orders={orders} loading={loadingOrders} />
                    )}
                    {activeTab === 'Personal Info' && (
                        <PersonalInfoTab profile={profile} />
                    )}
                </div>

            </div>
        </div>
    )
}

// ── Orders Tab ─────────────────────────────────────────────

function OrdersTab({ orders, loading }) {
    if (loading) return (
        <div className={styles.ordersList}>
            {[1, 2, 3].map(i => (
                <div key={i} className={styles.orderSkeletonCard} />
            ))}
        </div>
    )

    if (orders.length === 0) return (
        <div className={styles.emptyOrders}>
            <p className={styles.emptyTitle}>No orders yet</p>
            <p className={styles.emptySub}>When you place an order it will appear here.</p>
        </div>
    )

    return (
        <div className={styles.ordersList}>
            {orders.map(order => (
                <div key={order.id} className={styles.orderCard}>

                    {/* Order header */}
                    <div className={styles.orderHeader}>
                        <div>
                            <p className={styles.orderNumber}>{order.order_number}</p>
                            <p className={styles.orderDate}>
                                {new Date(order.created_at).toLocaleDateString('en-NG', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                            {order.status.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Order items */}
                    <div className={styles.orderItems}>
                        {order.items?.map((item, i) => (
                            <div key={i} className={styles.orderItem}>
                                <span className={styles.orderItemName}>{item.name}</span>
                                <span className={styles.orderItemQty}>x{item.quantity}</span>
                                <span className={styles.orderItemPrice}>
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* ── Feature 2: WhatsApp shortcut ── */}
                    <div className={styles.orderFooter}>
                        <span className={styles.orderTotal}>
                            Total — {formatPrice(order.total)}
                        </span>
                        
                         <a   href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I'm following up on order ${order.order_number}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.whatsappBtn}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.854L.057 23.882l6.19-1.438A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.498-5.177-1.367l-.369-.214-3.677.854.88-3.574-.234-.38A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            Follow up on WhatsApp
                        </a>
                    </div>

                </div>
            ))}
        </div>
    )
}

// ── Personal Info Tab ──────────────────────────────────────

function PersonalInfoTab({ profile }) {
    return (
        <div className={styles.infoSection}>

            <div className={styles.infoGroup}>
                <p className={styles.infoLabel}>Full Name</p>
                <p className={styles.infoValue}>{profile.fullName}</p>
            </div>

            <div className={styles.infoGroup}>
                <p className={styles.infoLabel}>Email Address</p>
                <p className={styles.infoValue}>{profile.email}</p>
            </div>

            <div className={styles.infoGroup}>
                <p className={styles.infoLabel}>Account</p>
                <p className={styles.infoValue}>Standard</p>
            </div>

            <p className={styles.infoNote}>
                To update your name or email, contact us on WhatsApp.
            </p>

        </div>
    )
}