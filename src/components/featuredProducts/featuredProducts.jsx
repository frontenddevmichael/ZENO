import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getFeaturedProducts } from "../../lib/utilities/query"
import ProductCard from "../../../src/components/products/ProductCard"
import styles from "./FeaturedProducts.module.css"

function SkeletonCard() {
    return (
        <div className={styles.skeletonCard}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonInfo}>
                <div className={`${styles.skeletonLine} ${styles.skeletonName}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonPrice}`} />
            </div>
        </div>
    )
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getFeaturedProducts()
                setProducts(data)
            } catch (err) {
                setError("Couldn't load products. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <section className={styles.section}>

            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <span className={styles.eyebrow}>Curated for you</span>
                    <h2 className={styles.heading}>Selected.</h2>
                </div>
                <Link to="/shop" className={styles.viewAll}>
                    View all <span aria-hidden="true">→</span>
                </Link>
            </div>

            {error ? (
                <div className={styles.errorState}>
                    <p>{error}</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {loading
                        ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                        : products.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))
                    }
                </div>
            )}

        </section>
    )
}