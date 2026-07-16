import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from 'react-router-dom';
import Login from './Login';
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

describe('Login', () => {
    const mockLogin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        useAuth.mockReturnValue({ login: mockLogin });
    });

    it('affiche le formulaire de connexion', () => {
        renderWithRoutes(
            <Route path="/login" element={<Login />} />,
            { initialEntries: ['/login'] },
        );
        expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    });

    it('connecte l\'utilisateur et redirige', async () => {
        mockLogin.mockResolvedValueOnce(undefined);
        const user = userEvent.setup();
        renderWithRoutes(
            <Route path="/login" element={<Login />} />,
            { initialEntries: ['/login'] },
        );

        await user.type(screen.getByLabelText(/email/i), 'user@weeb.local');
        await user.type(screen.getByLabelText(/mot de passe/i), 'password123');
        await user.click(screen.getByRole('button', { name: /se connecter/i }));

        expect(mockLogin).toHaveBeenCalledWith('user@weeb.local', 'password123');
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('affiche une erreur en cas d\'échec', async () => {
        mockLogin.mockRejectedValueOnce({ data: { detail: 'Compte non activé.' } });
        const user = userEvent.setup();
        renderWithRoutes(
            <Route path="/login" element={<Login />} />,
            { initialEntries: ['/login'] },
        );

        await user.type(screen.getByLabelText(/email/i), 'pending@weeb.local');
        await user.type(screen.getByLabelText(/mot de passe/i), 'password123');
        await user.click(screen.getByRole('button', { name: /se connecter/i }));

        expect(await screen.findByText('Compte non activé.')).toBeInTheDocument();
    });
});
