import { useState, useEffect } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import styles from "./Nav.module.css"
import { useCartStore } from "../../../store/cartStore"
import { useUIStore } from "../../../store/uiStore"
import { useAuthStore } from '../../../store/authStore'
import { supabase } from '../../../lib/supabase'

export function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const isHomePage = location.pathname === "/"

    const itemCount = useCartStore(state => state.itemCount())
    const openCart = useCartStore(state => state.openCart)
    const openSearch = useUIStore(state => state.openSearch)
    const openProfile = useUIStore(state => state.openProfile)
    const user = useAuthStore(state => state.user)

    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [menuOpen])

    async function handleSignOut() {
        setMenuOpen(false)
        await supabase.auth.signOut()
        navigate('/')
    }

    // Fix: use correct class name (navbar not navBar)
    const navClass = [
        styles.navbar,
        scrolled || !isHomePage ? styles.navbarScrolled : ''
    ].join(' ')

    return (
        <>
            <nav className={navClass}>
                <div className={styles.content}>

                    {/* Logo */}
                    <Link
                        to="/"
                        className={styles.navLogo}
                        onClick={() => setMenuOpen(false)}
                    >
                        <span className={styles.logoWordmark}>Zeno</span>
                    </Link>

                    {/* Center nav links */}
                    <div className={styles.navLinks}>
                        {[
                            { to: '/shop', label: 'Shop' },
                            { to: '/about', label: 'About' },
                            { to: '/contact', label: 'Contact' },
                        ].map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div className={styles.navActions}>

                        {/* Search */}
                        <button
                            className={styles.iconBtn}
                            onClick={openSearch}
                            aria-label="Search"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>

                        {/* Cart — always visible */}
                        <button
                            className={styles.iconBtn}
                            onClick={openCart}
                            aria-label="Open cart"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                <path d="M3 6h18" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {itemCount > 0 && (
                                <span className={styles.cartBadge}>{itemCount}</span>
                            )}
                        </button>

                        {/* User icon — with logged-in dot indicator */}
                        <button
                            className={styles.iconBtn}
                            onClick={openProfile}
                            aria-label="Open profile"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                            {user && <span className={styles.userDot} aria-hidden="true" />}
                        </button>

                        {/* Sign in / Sign out pill */}
                        {user ? (
                            <button onClick={handleSignOut} className={styles.pill}>
                                Sign out
                            </button>
                        ) : (
                            <Link to="/login" className={styles.pill}>
                                Sign in
                            </Link>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className={`${styles.menuBtn} ${menuOpen ? styles.menuOpen : ''}`}
                            onClick={() => setMenuOpen(prev => !prev)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                        >
                            <span className={styles.menuBar} />
                            <span className={styles.menuBar} />
                            <span className={styles.menuBar} />
                        </button>

                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <div
                className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
                aria-hidden={!menuOpen}
            >
                {[
                    { to: '/shop', label: 'Shop' },
                    { to: '/about', label: 'About' },
                    { to: '/contact', label: 'Contact' },
                ].map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={styles.mobileLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        {label}
                        <span className={styles.mobileLinkArrow}>→</span>
                    </NavLink>
                ))}

                <div className={styles.mobileDivider} />

                {user ? (
                    <button className={styles.mobileLink} onClick={handleSignOut}>
                        Sign out
                        <span className={styles.mobileLinkArrow}>→</span>
                    </button>
                ) : (
                    <NavLink
                        to="/login"
                        className={styles.mobileLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        Sign in
                        <span className={styles.mobileLinkArrow}>→</span>
                    </NavLink>
                )}
            </div>
        </>
    )
}