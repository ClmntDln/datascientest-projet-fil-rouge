import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSearchFilter } from './useSearchFilter';

const items = [
    { id: 1, name: 'Jean Dupont', email: 'jean@weeb.local' },
    { id: 2, name: 'Marie Martin', email: 'marie@weeb.local' },
];

const getSearchText = (item) => `${item.name} ${item.email}`;

describe('useSearchFilter', () => {
    it('retourne tous les éléments sans recherche', () => {
        const { result } = renderHook(() =>
            useSearchFilter(items, getSearchText),
        );

        expect(result.current.filtered).toEqual(items);
        expect(result.current.query).toBe('');
    });

    it('filtre les éléments selon la requête, insensible à la casse', () => {
        const { result } = renderHook(() =>
            useSearchFilter(items, getSearchText),
        );

        act(() => {
            result.current.setQuery('MARIE');
        });

        expect(result.current.filtered).toEqual([items[1]]);
    });

    it('retourne un tableau vide si aucun élément ne correspond', () => {
        const { result } = renderHook(() =>
            useSearchFilter(items, getSearchText),
        );

        act(() => {
            result.current.setQuery('inexistant');
        });

        expect(result.current.filtered).toEqual([]);
    });

    it('ignore les espaces superflus dans la requête', () => {
        const { result } = renderHook(() =>
            useSearchFilter(items, getSearchText),
        );

        act(() => {
            result.current.setQuery('   jean   ');
        });

        expect(result.current.filtered).toEqual([items[0]]);
    });
});
