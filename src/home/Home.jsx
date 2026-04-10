import CategoryStrip from './CategoryStrip';
import Hero from './Hero/Hero';
import PromoBanner from './PromoBanner';
import FeaturedProducts from './featuredProducts/featuredProducts'
import WhatsAppButton from './whatsappButton/whatsappButton';
import TrustSection from './TrustSection';
import EditorialStrip from './EditorialStrip'


export default function HomePage() {
    return (
        <main>
            <Hero />
            <FeaturedProducts />
            <CategoryStrip />
            <PromoBanner />
            <EditorialStrip />
            <TrustSection />
            <WhatsAppButton />
        </main>
    );
}

