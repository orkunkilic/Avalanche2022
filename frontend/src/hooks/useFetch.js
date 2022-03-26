import { useState, useEffect } from 'react';

export const useFetch = (item, query) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let base;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        base = 'http://localhost:3000/'
    } else {
        base = 'https://expirydator.herokuapp.com/'
    }
    const url = query ? (item + '?' + query ) : item
    useEffect(() => {
        fetch(base + url)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                setLoading(false);
                setError(err)
            })
    }, [url])

    return { data, loading, error }
}