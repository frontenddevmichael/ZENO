import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './SignupPage.module.css'
import Toast from '../components/Toast'
import { useToast } from '../lib/useToast'

export default function SignupPage() {
    const navigate = useNavigate()
    const { toast, showToast, dismissToast } = useToast()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        if (!fullName.trim()) {
            showToast('Please enter your full name', 'warning')
            return
        }
        if (password.length < 8) {
            showToast('Password must be at least 8 characters', 'warning')
            return
        }
        if (password !== confirmPassword) {
            showToast("Passwords don't match", 'warning')
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName.trim() }
                }
            })

            if (error) {
                showToast(error.message, 'error')
                return
            }

            navigate('/login', { state: { signupToast: fullName.trim().split(' ')[0] } })
        } catch (err) {
            showToast('Something went wrong. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create an account</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </form>
            </div>
            <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
        </div>
    )
}