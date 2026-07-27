import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminUsers from './AdminUsers';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { renderWithRouter } from '../test/utils';

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

const users = [
    {
        id: 1,
        email: 'jean@weeb.local',
        first_name: 'Jean',
        last_name: 'Dupont',
        is_active: true,
        is_staff: false,
        is_superuser: false,
        date_joined: '2026-01-10T10:00:00Z',
    },
    {
        id: 2,
        email: 'marie@weeb.local',
        first_name: 'Marie',
        last_name: 'Martin',
        is_active: false,
        is_staff: false,
        is_superuser: false,
        date_joined: '2026-01-11T10:00:00Z',
    },
];

describe('AdminUsers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({ user: { id: 99, is_superuser: true } });
        apiFetch.mockResolvedValue(users);
    });

    it('affiche la liste des utilisateurs', async () => {
        renderWithRouter(<AdminUsers />, {
            route: '/admin/utilisateurs',
            path: '/admin/utilisateurs',
        });

        expect(await screen.findByText('jean@weeb.local')).toBeInTheDocument();
        expect(screen.getByText('marie@weeb.local')).toBeInTheDocument();
    });

    it('filtre les utilisateurs par recherche', async () => {
        const user = userEvent.setup();
        renderWithRouter(<AdminUsers />, {
            route: '/admin/utilisateurs',
            path: '/admin/utilisateurs',
        });

        await screen.findByText('jean@weeb.local');
        await user.type(screen.getByPlaceholderText(/rechercher/i), 'marie');

        await waitFor(() => {
            expect(
                screen.queryByText('jean@weeb.local'),
            ).not.toBeInTheDocument();
            expect(screen.getByText('marie@weeb.local')).toBeInTheDocument();
        });
    });

    it('active un utilisateur en attente', async () => {
        apiFetch.mockResolvedValueOnce(users);
        apiFetch.mockResolvedValueOnce({ ...users[1], is_active: true });
        const user = userEvent.setup();
        renderWithRouter(<AdminUsers />, {
            route: '/admin/utilisateurs',
            path: '/admin/utilisateurs',
        });

        await screen.findByText('marie@weeb.local');
        await user.click(screen.getByRole('button', { name: 'Activer' }));

        expect(apiFetch).toHaveBeenLastCalledWith(
            '/auth/admin/users/2/',
            expect.objectContaining({
                method: 'PATCH',
                body: { is_active: true },
                auth: true,
            }),
        );
        await waitFor(() => {
            expect(
                screen.queryByRole('button', { name: 'Activer' }),
            ).not.toBeInTheDocument();
        });
    });

    it("affiche une erreur si l'action échoue", async () => {
        apiFetch.mockResolvedValueOnce(users);
        apiFetch.mockRejectedValueOnce(new Error('Action impossible.'));
        const user = userEvent.setup();
        renderWithRouter(<AdminUsers />, {
            route: '/admin/utilisateurs',
            path: '/admin/utilisateurs',
        });

        await screen.findByText('marie@weeb.local');
        await user.click(screen.getByRole('button', { name: 'Activer' }));

        expect(
            await screen.findByText('Action impossible.'),
        ).toBeInTheDocument();
    });
});
