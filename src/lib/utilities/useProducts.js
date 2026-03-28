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
                setError(null); 
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

