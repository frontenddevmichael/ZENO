import { useState, useEffect } from 'react';
import { getProducts } from '../utilities/query';

// 1. Add retryKey to the arguments
export function useProducts(filters, retryKey) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null); // 2. Clear previous error so the UI feels fresh
                const data = await getProducts(filters);
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();

    }, [filters.category, filters.min, filters.max, filters.sort, retryKey]);

    return { products, loading, error };
}