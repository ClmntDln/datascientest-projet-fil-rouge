import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import { useAuth } from '../context/AuthContext';
import { renderWithRoutes } from '../test/utils';

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('ResetPassword', () => {
    const mockRequest = vi.fn();
    const mockConfirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({
            requestPasswordReset: mockRequest,
            confirmPasswordReset: mockConfirm,
        });
    });

    it('affiche le formulaire de demande', () => {
        renderWithRoutes(
            <Route path="/reset-password" element={<ResetPassword />} />,
            { initialEntries: ['/reset-password'] },
        );

        expect(
            screen.getByRole('heading', { name: /mot de passe oublié/i }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('envoie une demande de réinitialisation', async () => {
        mockRequest.mockResolvedValueOnce({ detail: 'Email envoyé.' });
        const user = userEvent.setup();
        renderWithRoutes(
            <Route path="/reset-password" element={<ResetPassword />} />,
            { initialEntries: ['/reset-password'] },
        );

        await user.type(screen.getByLabelText('Email'), 'user@weeb.local');
        await user.click(
            screen.getByRole('button', { name: /envoyer la demande/i }),
        );

        expect(mockRequest).toHaveBeenCalledWith('user@weeb.local');
        expect(await screen.findByText('Email envoyé.')).toBeInTheDocument();
    });

    it("affiche le formulaire de confirmation depuis l'URL", async () => {
        renderWithRoutes(
            <Route path="/reset-password" element={<ResetPassword />} />,
            { initialEntries: ['/reset-password?uid=abc&token=xyz'] },
        );

        expect(
            await screen.findByLabelText('Nouveau mot de passe'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Confirmation')).toBeInTheDocument();
    });

    it('confirme la réinitialisation avec un nouveau mot de passe', async () => {
        mockConfirm.mockResolvedValueOnce({ detail: 'Mot de passe changé.' });
        const user = userEvent.setup();
        renderWithRoutes(
            <Route path="/reset-password" element={<ResetPassword />} />,
            { initialEntries: ['/reset-password?uid=abc&token=xyz'] },
        );

        await user.type(
            await screen.findByLabelText('Nouveau mot de passe'),
            'nouveaupass123',
        );
        await user.type(
            screen.getByLabelText('Confirmation'),
            'nouveaupass123',
        );
        await user.click(
            screen.getByRole('button', { name: /réinitialiser/i }),
        );

        expect(mockConfirm).toHaveBeenCalledWith(
            'abc',
            'xyz',
            'nouveaupass123',
        );
        expect(
            await screen.findByText(/a été réinitialisé/i),
        ).toBeInTheDocument();
    });

    it('refuse la confirmation si les mots de passe diffèrent', async () => {
        const user = userEvent.setup();
        renderWithRoutes(
            <Route path="/reset-password" element={<ResetPassword />} />,
            { initialEntries: ['/reset-password?uid=abc&token=xyz'] },
        );

        await user.type(
            await screen.findByLabelText('Nouveau mot de passe'),
            'motdepasse1',
        );
        await user.type(screen.getByLabelText('Confirmation'), 'motdepasse2');
        await user.click(
            screen.getByRole('button', { name: /réinitialiser/i }),
        );

        expect(mockConfirm).not.toHaveBeenCalled();
        expect(screen.getByText(/ne correspondent pas/i)).toBeInTheDocument();
    });
});
