import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAsyncData } from './useAsyncData';

describe('useAsyncData', () => {
    it('charge les données au montage et passe loading à false', async () => {
        const fetcher = vi.fn().mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useAsyncData(fetcher));

        expect(result.current.loading).toBe(true);

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.data).toEqual({ id: 1 });
        expect(result.current.error).toBe('');
        expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it("expose l'erreur du fetcher et vide les données", async () => {
        const fetcher = vi.fn().mockRejectedValue(new Error('Erreur API'));
        const { result } = renderHook(() =>
            useAsyncData(fetcher, [], { errorMessage: 'Erreur par défaut' }),
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Erreur API');
        expect(result.current.data).toBeNull();
    });

    it("utilise le message d'erreur par défaut si l'erreur n'a pas de message", async () => {
        const fetcher = vi.fn().mockRejectedValue({});
        const { result } = renderHook(() =>
            useAsyncData(fetcher, [], { errorMessage: 'Erreur par défaut' }),
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Erreur par défaut');
    });

    it('ne charge pas les données si enabled est false', () => {
        const fetcher = vi.fn();
        const { result } = renderHook(() =>
            useAsyncData(fetcher, [], { enabled: false }),
        );

        expect(result.current.loading).toBe(false);
        expect(fetcher).not.toHaveBeenCalled();
    });

    it('recharge les données via reload', async () => {
        const fetcher = vi
            .fn()
            .mockResolvedValueOnce({ id: 1 })
            .mockResolvedValueOnce({ id: 2 });
        const { result } = renderHook(() => useAsyncData(fetcher));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.data).toEqual({ id: 1 });

        await act(async () => {
            await result.current.reload();
        });

        expect(result.current.data).toEqual({ id: 2 });
        expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it('permet de mettre à jour les données manuellement via setData', async () => {
        const fetcher = vi.fn().mockResolvedValue([{ id: 1 }]);
        const { result } = renderHook(() => useAsyncData(fetcher));

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.setData((list) => [...list, { id: 2 }]);
        });

        expect(result.current.data).toEqual([{ id: 1 }, { id: 2 }]);
    });
});
