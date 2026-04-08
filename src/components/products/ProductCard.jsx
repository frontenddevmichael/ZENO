import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCartStore } from "../../store/cartStore"
import styles from "./ProductCard.module.css"

export default function ProductCard({ id, name, images, price, badge, stock, slug }) {
    const navigate = useNavigate()
    const addItem = useCartStore((state) => state.addItem)
    const [added, setAdded] = useState(false)
    const inStock = stock > 0

    const productImage = images


    const handleClick = () => navigate(`/shop/${slug}`);

    const handleAddToCart = (e) => {
        e.stopPropagation()
        if (!inStock) return
        addItem({ id, name, price, images, slug })
        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
    }

    return (
        <article
            className={`${styles.card} ${!inStock ? styles.outOfStock : ""}`}
            onClick={handleClick}
            tabIndex={0}
            aria-label={`View ${name}`}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
        >
            <div className={styles.imageArea}>

                {badge && <span className={styles.badge}>{badge}</span>}
                {!inStock && <span className={styles.soldOut}>Out of stock</span>}

                <img
                    src={productImage}
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

                <div className={styles.priceWrapper}>
                    <span className={styles.price}>₦{price.toLocaleString()}</span>
                    <span className={styles.priceHover} aria-hidden="true" >View →</span>
                </div>
            </div>

        </article>
    )
}