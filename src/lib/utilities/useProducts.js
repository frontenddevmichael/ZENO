import { useState, useEffect } from 'react';
import { getProducts } from '../utilities/query';

export function useProducts(filters) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await getProducts(filters);
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [filters.category, filters.min, filters.max, filters.sort]);

    return { products, loading, error };
}