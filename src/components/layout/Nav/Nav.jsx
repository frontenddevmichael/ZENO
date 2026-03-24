import { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import styles from "./Nav.module.css"
import { useCartStore } from "../../../store/cartStore"

export function Navbar() {
    const itemCount = useCartStore(state => state.itemCount())
    const openCart = useCartStore(state => state.openCart)

    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [menuOpen])

    const navClass = scrolled ? styles.navbarScrolled : styles.navbar

    return (
        <>
            <nav className={navClass}>
                <div className={styles.content}>

                    {/* ── LOGO ── */}
                    <Link to="/" className={styles.navLogo} onClick={() => setMenuOpen(false)}>
                        <div className={styles.logoInner}>
                            {/* Full wordmark — shown at top of page */}
                            <span className={styles.logoWordmark}>Zeno</span>
                            {/* Monogram — shown when scrolled */}
                            <span className={styles.logoMono}>
                                Z<span>.</span>
                            </span>
                        </div>
                    </Link>

                    {/* ── DESKTOP LINKS ── */}
                    <div className={styles.navLinks}>
                        <NavLink
                            to="/shop"
                            className={({ isActive }) =>
                                isActive ? styles.active : undefined
                            }
                        >
                            Shop
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                isActive ? styles.active : undefined
                            }
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                isActive ? styles.active : undefined
                            }
                        >
                            Contact
                        </NavLink>
                    </div>

                    {/* ── ACTIONS ── */}
                    <div className={styles.navActions}>

                        {/* Cart button */}
                        <button
                            className={styles.cartBtn}
                            onClick={openCart}
                            aria-label={`Open cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                        >
                            {/* Shopping bag icon */}
                            <svg className={styles.cartIcon} viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>

                            {itemCount > 0 && (
                                <span className={styles.cartBadge} key={itemCount}>
                                    {itemCount > 99 ? "99+" : itemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            className={`${styles.menuBtn} ${menuOpen ? styles.menuOpen : ""}`}
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

            {/* ── MOBILE DRAWER ── */}
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