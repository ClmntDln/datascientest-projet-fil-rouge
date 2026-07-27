import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from 'react-router-dom';
import Article from './Article';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { renderWithRoutes } from '../test/utils';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

const article = {
    id: 1,
    title: 'Mon article',
    excerpt: 'Extrait',
    content: "Contenu de l'article",
    author: 5,
    author_name: 'Jean Dupont',
    created_at: '2026-01-15T10:00:00Z',
};

describe('Article', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({ user: null });
    });

    it("affiche le contenu de l'article", async () => {
        apiFetch.mockResolvedValueOnce(article);
        renderWithRoutes(<Route path="/blog/:id" element={<Article />} />, {
            initialEntries: ['/blog/1'],
        });

        expect(
            await screen.findByRole('heading', { name: 'Mon article' }),
        ).toBeInTheDocument();
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
        expect(screen.getByText("Contenu de l'article")).toBeInTheDocument();
    });

    it('affiche les actions pour le propriétaire', async () => {
        useAuth.mockReturnValue({ user: { id: 5 } });
        apiFetch.mockResolvedValueOnce(article);
        renderWithRoutes(<Route path="/blog/:id" element={<Article />} />, {
            initialEntries: ['/blog/1'],
        });

        await waitFor(() => {
            expect(
                screen.getByRole('link', { name: /modifier/i }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: /supprimer/i }),
            ).toBeInTheDocument();
        });
    });

    it("supprime l'article après confirmation", async () => {
        useAuth.mockReturnValue({ user: { id: 5 } });
        apiFetch.mockResolvedValueOnce(article);
        apiFetch.mockResolvedValueOnce(undefined);
        vi.stubGlobal(
            'confirm',
            vi.fn(() => true),
        );

        const user = userEvent.setup();
        renderWithRoutes(<Route path="/blog/:id" element={<Article />} />, {
            initialEntries: ['/blog/1'],
        });

        await user.click(
            await screen.findByRole('button', { name: /supprimer/i }),
        );
        expect(apiFetch).toHaveBeenCalledWith('/articles/1/', {
            method: 'DELETE',
            auth: true,
        });
        expect(mockNavigate).toHaveBeenCalledWith('/blog');
    });

    it('ne supprime pas si la confirmation est refusée', async () => {
        useAuth.mockReturnValue({ user: { id: 5 } });
        apiFetch.mockResolvedValueOnce(article);
        vi.stubGlobal(
            'confirm',
            vi.fn(() => false),
        );

        const user = userEvent.setup();
        renderWithRoutes(<Route path="/blog/:id" element={<Article />} />, {
            initialEntries: ['/blog/1'],
        });

        await user.click(
            await screen.findByRole('button', { name: /supprimer/i }),
        );

        expect(apiFetch).toHaveBeenCalledTimes(1);
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('affiche une erreur si la suppression échoue', async () => {
        useAuth.mockReturnValue({ user: { id: 5 } });
        apiFetch.mockResolvedValueOnce(article);
        apiFetch.mockRejectedValueOnce(new Error('Suppression refusée'));
        vi.stubGlobal(
            'confirm',
            vi.fn(() => true),
        );

        const user = userEvent.setup();
        renderWithRoutes(<Route path="/blog/:id" element={<Article />} />, {
            initialEntries: ['/blog/1'],
        });

        await user.click(
            await screen.findByRole('button', { name: /supprimer/i }),
        );

        expect(
            await screen.findByText('Suppression refusée'),
        ).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("affiche un message d'erreur si l'article est introuvable", async () => {
        apiFetch.mockRejectedValueOnce(new Error('Article introuvable.'));
        renderWithRoutes(<Route path="/blog/:id" element={<Article />} />, {
            initialEntries: ['/blog/1'],
        });

        expect(
            await screen.findByText('Article introuvable.'),
        ).toBeInTheDocument();
    });
});
