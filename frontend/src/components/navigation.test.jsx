import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Navigation from './navigation';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

describe('Navigation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderNav = () => render(
        <MemoryRouter>
            <Navigation logo="/logo.svg" />
        </MemoryRouter>,
    );

    it('affiche les liens publics pour un visiteur', () => {
        useAuth.mockReturnValue({ user: null, logout: vi.fn() });
        renderNav();

        expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Connexion' })).toBeInTheDocument();
    });

    it('affiche le menu utilisateur connecté', () => {
        useAuth.mockReturnValue({
            user: { first_name: 'Jean', is_active: true, is_staff: true },
            logout: vi.fn(),
        });
        renderNav();

        expect(screen.getByText('Jean')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Nouvel article' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Déconnexion' })).toBeInTheDocument();
    });

    it('appelle logout au clic sur déconnexion', async () => {
        const logout = vi.fn();
        useAuth.mockReturnValue({
            user: { first_name: 'Jean', is_active: true, is_staff: false },
            logout,
        });
        const user = userEvent.setup();
        renderNav();

        await user.click(screen.getByRole('button', { name: 'Déconnexion' }));
        expect(logout).toHaveBeenCalled();
    });
});
