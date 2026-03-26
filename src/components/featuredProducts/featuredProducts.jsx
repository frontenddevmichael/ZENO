import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { getFeaturedProducts } from "../../lib/utilities/query"
import ProductCard from "../products/ProductCard"
import styles from "../featuredProducts/featuredProducts.module.css"

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
    const [isVisible, setIsVisible] = useState(false)

    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

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
        <section
            ref={sectionRef}
            className={`${styles.section} ${isVisible ? styles.visible : ""}`}
        >

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
                            <div key={product.id} className={styles.cardWrapper}>
                                <ProductCard {...product} />
                            </div>
                        ))
                    }
                </div>
            )}

        </section>
    )
}