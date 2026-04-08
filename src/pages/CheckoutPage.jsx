import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {useCartStore} from '../store/cartStore'
import ShippingForm from '../components/checkout/ShippingForm'
import PaymentStep from '../components/checkout/PaymentStep'
import OrderSummary from '../components/checkout/OrderSummary'
import styles from './CheckoutPage.module.css'

const STEPS = ['Shipping', 'Payment', 'Review']

export default function CheckoutPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [shippingData, setShippingData] = useState(null)
    const { items, clearCart } = useCartStore()
    const navigate = useNavigate()

    if (items.length === 0) {
        navigate('/cart')
        return null
    }

    const handleShippingComplete = (data) => {
        setShippingData(data)
        setCurrentStep(2)
    }

    const handlePaymentSuccess = (txRef) => {
        clearCart()
        navigate(`/order/${txRef}`)
    }

    return (
        <div className={styles.page}>
            <div className={styles.progressBar}>
                {STEPS.map((step, index) => {
                    const stepNumber = index + 1
                    const isComplete = currentStep > stepNumber
                    const isActive = currentStep === stepNumber

                    return (
                        <div key={step} className={styles.progressItem}>
                            <div className={`${styles.stepCircle} ${isActive ? styles.active : ''} ${isComplete ? styles.complete : ''}`}>
                                {isComplete
                                    ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    : stepNumber
                                }
                            </div>
                            <span className={`${styles.stepLabel} ${isActive ? styles.activeLabel : ''}`}>
                                {step}
                            </span>
                            {index < STEPS.length - 1 && (
                                <div className={`${styles.connector} ${isComplete ? styles.connectorComplete : ''}`} />
                            )}
                        </div>
                    )
                })}
            </div>

            <div className={styles.layout}>
                <div className={styles.formCol}>
                    {currentStep === 1 && (
                        <ShippingForm onNext={handleShippingComplete} />
                    )}
                    {currentStep === 2 && (
                        <PaymentStep
                            shippingData={shippingData}
                            onSuccess={handlePaymentSuccess}
                        />
                    )}
                </div>

                <div className={styles.summaryCol}>
                    <OrderSummary shippingData={shippingData} />
                </div>
            </div>
        </div>
    )
}