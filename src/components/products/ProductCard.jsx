import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCartStore } from "../../store/cartStore"
import styles from "../products/ProductCard.module.css"

export default function ProductCard({ id, name, image, price, badge, inStock, slug }) {
    const navigate = useNavigate()
    const addItem = useCartStore((state) => state.addItem)

    const [added, setAdded] = useState(false)

    const handleClick = () => {
        navigate(`/product/${slug}`)
    }

    const handleAddToCart = (e) => {
        e.stopPropagation()

        if (!inStock) return

        addItem({ id, name, price, image, slug })

        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
    }

    return (
        <article
            className={`${styles.card} ${!inStock ? styles.outOfStock : ""}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={`View ${name}`}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
        >
            <div className={styles.imageArea}>

                {badge && (
                    <span className={styles.badge}>{badge}</span>
                )}

                {!inStock && (
                    <span className={styles.soldOut}>Out of stock</span>
                )}

                <img
                    src={image}
                    alt={name}
                    className={styles.image}
                    loading="lazy"
                    draggable="false"
                />

                <button
                    className={`${styles.quickAdd} ${added ? styles.quickAddConfirmed : ""}`}
                    onClick={handleAddToCart}
                    disabled={!inStock || added}
                    aria-label={`Add ${name} to cart`}
                >
                    {added ? "Added ✓" : inStock ? "Add to Cart" : "Out of Stock"}
                </button>

            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.price}>
                    ₦{(price).toLocaleString()}
                </p>
            </div>

        </article>
    )
}