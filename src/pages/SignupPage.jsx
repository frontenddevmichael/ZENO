import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './SignupPage.module.css'


export default function SignupPage() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        } else if (password.length < 8 || confirmPassword.length < 8) {
            setError("Password must be at least 8 characters")
            setLoading(false)
            return
        } else {
            setLoading(true)
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            })

            if (!fullName.trim()) {
                setError("Please enter your full name")
                setLoading(false)
                return
            }
            
            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }
            navigate('/')
        }
    }
    return (
        <>
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
                                id='email'
                                type='email'
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
                                type='password'
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
                                type='password'
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        {error && <p className={styles.error}>{error}</p>
                        }
                        <button type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}