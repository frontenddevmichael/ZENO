import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './LoginPage.module.css'
import Toast from '../components/Toast'
import { useToast } from '../lib/useToast'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { toast, showToast, dismissToast } = useToast()
    const profile = useAuthStore(state => state.profile)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (location.state?.signupToast) {
            showToast(`Account created, ${location.state.signupToast}. Sign in to continue.`, 'info')
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) {
                showToast(error.message, 'error')
                return
            }

            navigate('/shop')
        } catch (err) {
            showToast('Something went wrong. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Sign in</h1>
                <p className={styles.subtitle}>Welcome back to Zeno.</p>
                <form onSubmit={handleSubmit} className={styles.form}>
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

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className={styles.switch}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
            <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
        </div>
    )
}