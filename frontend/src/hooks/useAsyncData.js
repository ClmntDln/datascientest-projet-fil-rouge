import { useCallback, useEffect, useState } from 'react';

export function useAsyncData(fetcher, deps = [], options = {}) {
    const { errorMessage = 'Erreur de chargement.', enabled = true } = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState('');

    const reload = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const result = await fetcher();
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || errorMessage);
            setData(null);
            return null;
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        if (enabled) {
            reload();
        }
    }, [enabled, reload]);

    return { data, setData, loading, error, reload };
}
