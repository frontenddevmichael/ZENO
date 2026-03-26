import { useState, useEffect } from 'react';
import { getProductBySlug } from '../supabase/queries';

export function useProduct(slug) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        async function fetchData() {
            setLoading(true);
            const data = await getProductBySlug(slug);
            setProduct(data);
            setLoading(false);
        }
        fetchData();
    }, [slug]);

    return { product, loading };
}