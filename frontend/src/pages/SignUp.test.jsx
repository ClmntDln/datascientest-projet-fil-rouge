import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUp from './SignUp';
import { useAuth } from '../context/AuthContext';
import { renderWithRouter } from '../test/utils';

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('SignUp', () => {
    const mockSignup = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({ signup: mockSignup });
    });

    it("affiche le formulaire d'inscription", () => {
        renderWithRouter(<SignUp />, { route: '/signup', path: '/signup' });
        expect(
            screen.getByRole('heading', { name: /s'enregistrer/i }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
        expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    });

    it('refuse des mots de passe différents', async () => {
        const user = userEvent.setup();
        renderWithRouter(<SignUp />, { route: '/signup', path: '/signup' });

        await user.type(screen.getByLabelText('Prénom'), 'Jean');
        await user.type(screen.getByLabelText('Nom'), 'Dupont');
        await user.type(screen.getByLabelText('Email'), 'jean@weeb.local');
        await user.type(screen.getByLabelText('Mot de passe'), 'password123');
        await user.type(screen.getByLabelText('Confirmation'), 'autrepass');
        await user.click(
            screen.getByRole('button', { name: /créer mon compte/i }),
        );

        expect(mockSignup).not.toHaveBeenCalled();
        expect(screen.getByText(/ne correspondent pas/i)).toBeInTheDocument();
    });

    it('crée un compte avec succès', async () => {
        mockSignup.mockResolvedValueOnce({});
        const user = userEvent.setup();
        renderWithRouter(<SignUp />, { route: '/signup', path: '/signup' });

        await user.type(screen.getByLabelText('Prénom'), 'Jean');
        await user.type(screen.getByLabelText('Nom'), 'Dupont');
        await user.type(screen.getByLabelText('Email'), 'jean@weeb.local');
        await user.type(screen.getByLabelText('Mot de passe'), 'password123');
        await user.type(screen.getByLabelText('Confirmation'), 'password123');
        await user.click(
            screen.getByRole('button', { name: /créer mon compte/i }),
        );

        expect(mockSignup).toHaveBeenCalledWith({
            first_name: 'Jean',
            last_name: 'Dupont',
            email: 'jean@weeb.local',
            password: 'password123',
        });
        expect(
            await screen.findByText(/inscription réussie/i),
        ).toBeInTheDocument();
    });
});
