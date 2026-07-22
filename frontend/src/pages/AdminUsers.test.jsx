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
        renderWithRouter(<AdminUsers />, { route: '/admin/utilisateurs', path: '/admin/utilisateurs' });

        expect(await screen.findByText('jean@weeb.local')).toBeInTheDocument();
        expect(screen.getByText('marie@weeb.local')).toBeInTheDocument();
    });

    it('filtre les utilisateurs par recherche', async () => {
        const user = userEvent.setup();
        renderWithRouter(<AdminUsers />, { route: '/admin/utilisateurs', path: '/admin/utilisateurs' });

        await screen.findByText('jean@weeb.local');
        await user.type(screen.getByPlaceholderText(/rechercher/i), 'marie');

        await waitFor(() => {
            expect(screen.queryByText('jean@weeb.local')).not.toBeInTheDocument();
            expect(screen.getByText('marie@weeb.local')).toBeInTheDocument();
        });
    });
});
