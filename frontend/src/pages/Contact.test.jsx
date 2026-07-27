import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Contact from './Contact';
import { apiFetch } from '../api/client';
import { renderWithRouter } from '../test/utils';

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}));

describe('Contact', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche le formulaire de contact', () => {
        renderWithRouter(<Contact />, { route: '/contact', path: '/contact' });
        expect(
            screen.getByRole('heading', { name: /votre avis compte/i }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Nom')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Sujet')).toBeInTheDocument();
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('exige le consentement RGPD avant envoi', async () => {
        const user = userEvent.setup();
        renderWithRouter(<Contact />, { route: '/contact', path: '/contact' });

        await user.type(screen.getByLabelText('Nom'), 'Jean Dupont');
        await user.type(screen.getByLabelText('Email'), 'jean@weeb.local');
        await user.type(screen.getByLabelText('Sujet'), 'Question');
        await user.type(screen.getByLabelText('Message'), 'Bonjour');
        await user.click(screen.getByRole('button', { name: /envoyer/i }));

        expect(apiFetch).not.toHaveBeenCalled();
        expect(screen.getByText(/accepter le traitement/i)).toBeInTheDocument();
    });

    it('envoie le message avec consentement', async () => {
        apiFetch.mockResolvedValueOnce({});
        const user = userEvent.setup();
        renderWithRouter(<Contact />, { route: '/contact', path: '/contact' });

        await user.type(screen.getByLabelText('Nom'), 'Jean Dupont');
        await user.type(screen.getByLabelText('Email'), 'jean@weeb.local');
        await user.type(screen.getByLabelText('Sujet'), 'Question');
        await user.type(screen.getByLabelText('Message'), 'Bonjour');
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: /envoyer/i }));

        expect(apiFetch).toHaveBeenCalledWith('/contacts/', {
            method: 'POST',
            body: {
                name: 'Jean Dupont',
                email: 'jean@weeb.local',
                subject: 'Question',
                message: 'Bonjour',
                consent_given: true,
            },
        });
        expect(await screen.findByText(/bien été envoyé/i)).toBeInTheDocument();
    });

    it("affiche une erreur si l'API échoue", async () => {
        apiFetch.mockRejectedValueOnce(new Error('Erreur serveur'));
        const user = userEvent.setup();
        renderWithRouter(<Contact />, { route: '/contact', path: '/contact' });

        await user.type(screen.getByLabelText(/nom/i), 'Jean');
        await user.type(screen.getByLabelText(/email/i), 'jean@weeb.local');
        await user.type(screen.getByLabelText(/sujet/i), 'Test');
        await user.type(screen.getByLabelText(/message/i), 'Msg');
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: /envoyer/i }));

        expect(await screen.findByText('Erreur serveur')).toBeInTheDocument();
    });
});
