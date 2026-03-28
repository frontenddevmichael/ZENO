import { useState, useEffect } from 'react';
import { getProductBySlug } from '../utilities/query';


export function useProduct(slug) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                const fetchTask = getProductBySlug(slug);
                const [data] = await Promise.all([fetchTask]);

                setProduct(data);
            } catch (err) {
                console.error("Fetch Error:", err);
                setProduct(null);
            } finally {
                setLoading(false); // Now this only fires after the delay
            }
        }

        if (slug) load();
    }, [slug]);

    return { product, loading };
}