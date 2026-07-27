import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Blog from './Blog';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { renderWithRouter } from '../test/utils';

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('Blog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({ user: null });
    });

    it('affiche les articles', async () => {
        apiFetch.mockResolvedValueOnce({
            results: [
                {
                    id: 1,
                    title: 'Premier article',
                    excerpt: 'Extrait',
                    author_name: 'Jean',
                    created_at: '2026-01-15T10:00:00Z',
                },
            ],
        });
        renderWithRouter(<Blog />, { route: '/blog', path: '/blog' });

        expect(await screen.findByText('Premier article')).toBeInTheDocument();
        expect(screen.getByText('Extrait')).toBeInTheDocument();
    });

    it('affiche un message si aucun article', async () => {
        apiFetch.mockResolvedValueOnce({ results: [] });
        renderWithRouter(<Blog />, { route: '/blog', path: '/blog' });

        expect(await screen.findByText(/aucun article/i)).toBeInTheDocument();
    });

    it('affiche le bouton de création pour un utilisateur actif', async () => {
        useAuth.mockReturnValue({ user: { is_active: true } });
        apiFetch.mockResolvedValueOnce({ results: [] });
        renderWithRouter(<Blog />, { route: '/blog', path: '/blog' });

        await waitFor(() => {
            expect(
                screen.getByRole('link', { name: /écrire un article/i }),
            ).toBeInTheDocument();
        });
    });

    it('affiche une erreur si le chargement échoue', async () => {
        apiFetch.mockRejectedValueOnce(new Error('Erreur serveur'));
        renderWithRouter(<Blog />, { route: '/blog', path: '/blog' });

        expect(await screen.findByText('Erreur serveur')).toBeInTheDocument();
    });

    it('affiche la pagination et change de page', async () => {
        apiFetch.mockResolvedValueOnce({
            count: 25,
            results: [
                {
                    id: 1,
                    title: 'Article page 1',
                    excerpt: 'Extrait',
                    author_name: 'Jean',
                    created_at: '2026-01-15T10:00:00Z',
                },
            ],
        });
        apiFetch.mockResolvedValueOnce({
            count: 25,
            results: [
                {
                    id: 2,
                    title: 'Article page 2',
                    excerpt: 'Extrait',
                    author_name: 'Jean',
                    created_at: '2026-01-16T10:00:00Z',
                },
            ],
        });
        const user = userEvent.setup();
        renderWithRouter(<Blog />, { route: '/blog', path: '/blog' });

        expect(await screen.findByText('Article page 1')).toBeInTheDocument();
        expect(screen.getByText('Page 1 / 2')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /suivant/i }));

        expect(apiFetch).toHaveBeenLastCalledWith('/articles/?page=2');
        expect(await screen.findByText('Article page 2')).toBeInTheDocument();
    });
});
