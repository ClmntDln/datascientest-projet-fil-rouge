import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminMessages from './AdminMessages';
import { apiFetch } from '../api/client';
import { renderWithRouter } from '../test/utils';

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}));

const messages = [
    {
        id: 1,
        name: 'Jean Dupont',
        email: 'jean@weeb.local',
        subject: 'Question sur le blog',
        message: 'Bonjour, comment publier un article ?',
        created_at: '2026-01-10T10:00:00Z',
    },
    {
        id: 2,
        name: 'Marie Martin',
        email: 'marie@weeb.local',
        subject: 'Problème technique',
        message: 'Le formulaire ne fonctionne pas.',
        created_at: '2026-01-11T10:00:00Z',
    },
];

describe('AdminMessages', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche la liste des messages reçus', async () => {
        apiFetch.mockResolvedValueOnce(messages);
        renderWithRouter(<AdminMessages />, {
            route: '/admin/messages',
            path: '/admin/messages',
        });

        expect(
            await screen.findByText('Question sur le blog'),
        ).toBeInTheDocument();
        expect(screen.getByText('Problème technique')).toBeInTheDocument();
    });

    it('filtre les messages par recherche', async () => {
        apiFetch.mockResolvedValueOnce(messages);
        const user = userEvent.setup();
        renderWithRouter(<AdminMessages />, {
            route: '/admin/messages',
            path: '/admin/messages',
        });

        await screen.findByText('Question sur le blog');
        await user.type(screen.getByPlaceholderText(/rechercher/i), 'marie');

        await waitFor(() => {
            expect(
                screen.queryByText('Question sur le blog'),
            ).not.toBeInTheDocument();
            expect(screen.getByText('Problème technique')).toBeInTheDocument();
        });
    });

    it("affiche un message si aucun message n'est reçu", async () => {
        apiFetch.mockResolvedValueOnce([]);
        renderWithRouter(<AdminMessages />, {
            route: '/admin/messages',
            path: '/admin/messages',
        });

        expect(
            await screen.findByText(/aucun message pour le moment/i),
        ).toBeInTheDocument();
    });

    it('affiche une erreur si le chargement échoue', async () => {
        apiFetch.mockRejectedValueOnce(new Error('Erreur serveur'));
        renderWithRouter(<AdminMessages />, {
            route: '/admin/messages',
            path: '/admin/messages',
        });

        expect(await screen.findByText('Erreur serveur')).toBeInTheDocument();
    });
});
