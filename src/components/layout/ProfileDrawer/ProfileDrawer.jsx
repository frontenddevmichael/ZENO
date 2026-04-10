import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { useUIStore } from '../../../store/uiStore'
import { useAuthStore } from '../../../store/authStore'
import styles from './ProfileDrawer.module.css'

export default function ProfileDrawer() {
    const profileOpen = useUIStore(state => state.profileOpen)
    const closeProfile = useUIStore(state => state.closeProfile)
    const user = useAuthStore(state => state.user)
    const profile = useAuthStore(state => state.profile)
    const clearUser = useAuthStore(state => state.clearUser)
    const navigate = useNavigate()

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape') closeProfile()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    async function handleSignOut() {
        await supabase.auth.signOut()
        clearUser()
        closeProfile()
        navigate('/')
    }

    function handleLinkClick() {
        closeProfile()
    }

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${profileOpen ? styles.overlayVisible : ''}`}
                onClick={closeProfile}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={`${styles.drawer} ${profileOpen ? styles.drawerOpen : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Profile"
            >
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.headerTitle}>Account</span>
                    <button className={styles.closeBtn} onClick={closeProfile} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {user ? (
                    <div className={styles.content}>

                        {/* User identity */}
                        <div className={styles.identity}>
                            <div className={styles.avatar}>
                                {profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className={styles.identityInfo}>
                                <p className={styles.identityName}>{profile.fullName}</p>
                                <p className={styles.identityEmail}>{profile.email}</p>
                            </div>
                        </div>

                        {/* Quick links */}
                        <nav className={styles.links}>
                            <Link to="/profile" className={styles.link} onClick={handleLinkClick}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                </svg>
                                My Profile
                                <span className={styles.linkArrow}>→</span>
                            </Link>

                            <Link to="/profile" className={styles.link} onClick={handleLinkClick}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                                    <rect x="9" y="3" width="6" height="4" rx="1" />
                                </svg>
                                My Orders
                                <span className={styles.linkArrow}>→</span>
                            </Link>

                            <Link to="/shop" className={styles.link} onClick={handleLinkClick}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                Browse Shop
                                <span className={styles.linkArrow}>→</span>
                            </Link>

                            <Link to="/contact" className={styles.link} onClick={handleLinkClick}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                Contact Support
                                <span className={styles.linkArrow}>→</span>
                            </Link>
                        </nav>

                        {/* Sign out */}
                        <div className={styles.footer}>
                            <button className={styles.signOutBtn} onClick={handleSignOut}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Sign out
                            </button>
                        </div>

                    </div>
                ) : (
                    // Not logged in state
                    <div className={styles.content}>
                        <div className={styles.guestState}>
                            <p className={styles.guestTitle}>You're not signed in</p>
                            <p className={styles.guestSub}>Sign in to view your orders and manage your account.</p>
                            <Link to="/login" className={styles.guestLoginBtn} onClick={handleLinkClick}>
                                Sign in
                            </Link>
                            <Link to="/signup" className={styles.guestSignupLink} onClick={handleLinkClick}>
                                Create an account
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}