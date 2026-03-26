import { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import styles from "./Nav.module.css"
import { useCartStore } from "../../../store/cartStore"
import { useUIStore } from "../../../store/uiStore"


export function Navbar() {
    const itemCount = useCartStore(state => state.itemCount())
    const openCart = useCartStore(state => state.openCart)
    const openSearch = useUIStore(state => state.openSearch)

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

    const navClass = scrolled ? styles.navbarScrolled : styles.navbar

    return (
        <>
            <nav className={navClass}>
                <div className={styles.content}>
                    <Link to="/" className={styles.navLogo} onClick={() => setMenuOpen(false)}>
                        <div className={styles.logoInner}>
                            <span className={styles.logoWordmark}>Zeno</span>
                        </div>
                    </Link>

                    <div className={styles.navLinks}>
                        <NavLink
                            to="/shop"
                            className={({ isActive }) => isActive ? styles.active : undefined}
                        >
                            Shop
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) => isActive ? styles.active : undefined}
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className={({ isActive }) => isActive ? styles.active : undefined}
                        >
                            Contact
                        </NavLink>
                    </div>

                    <div className={styles.navActions}>
                        <button
                            className={styles.searchBtn}
                            onClick={openSearch}
                            aria-label="Search"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>

                        <button
                            className={styles.cartBtn}
                            onClick={openCart}
                            aria-label="Open Cart"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                <path d="M3 6h18" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
                        </button>

                        <Link to="/shop" className={styles.shopNow}>
                            <span>Shop Now</span>
                        </Link>

                        <button
                            className={`${styles.menuBtn} ${menuOpen ? styles.menuOpen : ""}`}
                            onClick={() => setMenuOpen(prev => !prev)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                        >
                            <span className={styles.menuBar} />
                            <span className={styles.menuBar} />
                            <span className={styles.menuBar} />
                        </button>
                    </div>
                </div>
            </nav>

            <div
                className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
                aria-hidden={!menuOpen}
            >
                {[
                    { to: "/shop", label: "Shop" },
                    { to: "/about", label: "About" },
                    { to: "/contact", label: "Contact" },
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
            </div>
        </>
    )
}