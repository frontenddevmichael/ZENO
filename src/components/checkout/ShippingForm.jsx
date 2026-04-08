import { useState } from 'react'
import nigerianStates from '../../lib/utilities/nigerianStates'
import styles from './ShippingForm.module.css'

const isEmpty = (val) => !val || val.trim() === ''
const isValidPhone = (val) => /^(07|08|09)\d{9}$/.test(val.trim())
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())

export default function ShippingForm({ onNext }) {
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        landmark: ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (isEmpty(form.fullName)) newErrors.fullName = 'Full name is required'
        if (isEmpty(form.phone)) newErrors.phone = 'Phone number is required'
        else if (!isValidPhone(form.phone)) newErrors.phone = 'Enter a valid Nigerian number (e.g. 08012345678)'
        if (isEmpty(form.email)) newErrors.email = 'Email address is required'
        else if (!isValidEmail(form.email)) newErrors.email = 'Enter a valid email address'
        if (isEmpty(form.address)) newErrors.address = 'Delivery address is required'
        if (isEmpty(form.city)) newErrors.city = 'City is required'
        if (isEmpty(form.state)) newErrors.state = 'Please select a state'

        return newErrors
    }

    const handleSubmit = () => {
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        onNext(form)
    }

    return (
        <div className={styles.form}>
            <h2 className={styles.heading}>Delivery details</h2>

            <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input
                    className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Ada Okonkwo"
                />
                {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Phone number <span className={styles.required}>— main contact</span></label>
                    <input
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="08012345678"
                    />
                    {errors.phone && <p className={styles.error}>{errors.phone}</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Email address</label>
                    <input
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="ada@example.com"
                    />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Delivery address</label>
                <input
                    className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="14 Admiralty Way, Lekki Phase 1"
                />
                {errors.address && <p className={styles.error}>{errors.address}</p>}
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>City</label>
                    <input
                        className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Lagos"
                    />
                    {errors.city && <p className={styles.error}>{errors.city}</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>State</label>
                    <select
                        className={`${styles.input} ${styles.select} ${errors.state ? styles.inputError : ''}`}
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                    >
                        <option value="">Select a state</option>
                        {nigerianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    {errors.state && <p className={styles.error}>{errors.state}</p>}
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>
                    Closest landmark
                    <span className={styles.optional}> — optional, helps with delivery</span>
                </label>
                <input
                    className={styles.input}
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="Near Shoprite, Ikeja"
                />
            </div>

            <button className={styles.continueBtn} onClick={handleSubmit}>
                Continue to payment →
            </button>
        </div>
    )
}