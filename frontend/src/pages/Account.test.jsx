import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from 'react-router-dom';
import Account from './Account';
import { useAuth } from '../hooks/useAuth';
import { renderWithRoutes } from '../test/utils';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

describe('Account', () => {
    const mockExport = vi.fn();
    const mockDelete = vi.fn();
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({
            user: {
                first_name: 'Jean',
                last_name: 'Dupont',
                email: 'jean@weeb.local',
                is_active: true,
                is_staff: false,
            },
            exportAccount: mockExport,
            deleteAccount: mockDelete,
            logout: mockLogout,
        });
    });

    it('affiche les informations du compte', () => {
        renderWithRoutes(
            <Route path="/compte" element={<Account />} />,
            { initialEntries: ['/compte'] },
        );
        expect(screen.getByRole('heading', { name: /mon compte/i })).toBeInTheDocument();
        expect(screen.getByText(/jean@weeb.local/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /exporter mes données/i })).toBeInTheDocument();
    });

    it('exporte les données personnelles', async () => {
        mockExport.mockResolvedValueOnce({ profile: { email: 'jean@weeb.local' } });
        const user = userEvent.setup();
        renderWithRoutes(
            <Route path="/compte" element={<Account />} />,
            { initialEntries: ['/compte'] },
        );

        await user.click(screen.getByRole('button', { name: /exporter mes données/i }));
        expect(mockExport).toHaveBeenCalled();
        expect(await screen.findByText(/ont été exportées/i)).toBeInTheDocument();
    });

    it('masque la suppression pour les comptes staff', () => {
        useAuth.mockReturnValue({
            user: {
                first_name: 'Admin',
                last_name: 'Weeb',
                email: 'admin@weeb.local',
                is_active: true,
                is_staff: true,
            },
            exportAccount: mockExport,
            deleteAccount: mockDelete,
            logout: mockLogout,
        });
        renderWithRoutes(
            <Route path="/compte" element={<Account />} />,
            { initialEntries: ['/compte'] },
        );
        expect(screen.queryByRole('button', { name: /supprimer mon compte/i })).not.toBeInTheDocument();
    });
});
