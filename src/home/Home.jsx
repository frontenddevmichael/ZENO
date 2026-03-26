import CategoryStrip from './CategoryStrip';
import Hero from './Hero/Hero';
import PromoBanner from './PromoBanner';
import FeaturedProducts from './featuredProducts/featuredProducts'
import WhatsAppButton from './whatsappButton/whatsappButton';
import ShopPage from '../pages/ShopPage';

export default function HomePage() {
    return (
        <main>
            <Hero />
            <FeaturedProducts />
            <CategoryStrip />
            <PromoBanner />
            <WhatsAppButton />
        </main>
    );
}