import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import {useCartStore} from '../../store/cartStore'
import styles from './PaymentStep.module.css'
import { formatPrice } from '../../lib/formatter'

export default function PaymentStep({ shippingData, onSuccess }) {
    const { items, total, clearCart } = useCartStore()

    const config = {
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: `ZN-${Date.now()}`,
        amount: total() / 1,
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: {
            email: shippingData.email,
            phone_number: shippingData.phone,
            name: shippingData.fullName,
        },
        customizations: {
            title: 'Zeno',
            description: `Order of ${items.length} item${items.length > 1 ? 's' : ''}`,
            logo: '/logo.png',
        },
    }

    const handleFlutterPayment = useFlutterwave(config)

    const handlePay = () => {
        handleFlutterPayment({
            callback: (response) => {
                closePaymentModal()
                if (response.status === 'successful') {
                    onSuccess(response.tx_ref)
                }
            },
            onClose: () => { },
        })
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.heading}>Payment</h2>
            <p className={styles.sub}>
                You'll be taken to a secure payment page. We accept cards, bank transfer, and USSD.
            </p>

            <div className={styles.summaryLine}>
                <span>Amount to pay</span>
                <span className={styles.amount}>{formatPrice(total())}</span>
            </div>

            <div className={styles.deliveryInfo}>
                <p className={styles.deliveryLabel}>Delivering to</p>
                <p className={styles.deliveryAddress}>
                    {shippingData.address}, {shippingData.city}, {shippingData.state}
                </p>
            </div>

            <button className={styles.payBtn} onClick={handlePay}>
                Pay securely →
            </button>

            <p className={styles.secured}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Secured by Flutterwave
            </p>
        </div>
    )
}