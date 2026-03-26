import { useNavigate } from 'react-router-dom';
import styles from './CategoryStrip.module.css';
import laptopImg from '../../public/Laptop.jpeg';
import phoneImg from '../../public/Phoneimg.jpg';
import audioImg from '../../public/Audioimg.jpg'

const CATEGORIES = [
    { id: 1, name: 'Phones', slug: 'phones', image: phoneImg  },
    { id: 2, name: 'Laptops', slug: 'laptops', image: laptopImg },
    { id: 3, name: 'Audio', slug: 'audio', image: audioImg },
];

export default function CategoryStrip() {
    const navigate = useNavigate();

    return (
        <section className={styles.strip}>
            {CATEGORIES.map((cat) => (
                <div
                    key={cat.id}
                    className={styles.card}
                    onClick={() => navigate(`/shop?category=${cat.slug}`)}
                >
                    <div className={styles.imageWrapper}>
                        <img src={cat.image} alt={cat.name} className={styles.image} />
                        <div className={styles.overlay} />
                        <h2 className={styles.name}>{cat.name}</h2>
                    </div>
                </div>
            ))}
        </section>
    );
}