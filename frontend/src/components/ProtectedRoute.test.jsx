import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { renderWithRoutes } from '../test/utils';

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

const ProtectedContent = () => <div>Contenu protégé</div>;

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche un chargement pendant la vérification', () => {
        useAuth.mockReturnValue({ user: null, loading: true });
        renderWithRoutes(
            <>
                <Route
                    path="/prive"
                    element={
                        <ProtectedRoute>
                            <ProtectedContent />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<div>Page login</div>} />
            </>,
            { initialEntries: ['/prive'] },
        );
        expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    });

    it('redirige vers login si non authentifié', () => {
        useAuth.mockReturnValue({ user: null, loading: false });
        renderWithRoutes(
            <>
                <Route
                    path="/prive"
                    element={
                        <ProtectedRoute>
                            <ProtectedContent />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<div>Page login</div>} />
            </>,
            { initialEntries: ['/prive'] },
        );
        expect(screen.getByText('Page login')).toBeInTheDocument();
    });

    it('affiche le contenu pour un utilisateur actif', () => {
        useAuth.mockReturnValue({
            user: {
                id: 1,
                email: 'user@weeb.local',
                is_active: true,
                is_staff: false,
            },
            loading: false,
        });
        renderWithRoutes(
            <Route
                path="/prive"
                element={
                    <ProtectedRoute>
                        <ProtectedContent />
                    </ProtectedRoute>
                }
            />,
            { initialEntries: ['/prive'] },
        );
        expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
    });

    it("bloque l'accès staff aux non-administrateurs", () => {
        useAuth.mockReturnValue({
            user: {
                id: 1,
                email: 'user@weeb.local',
                is_active: true,
                is_staff: false,
            },
            loading: false,
        });
        renderWithRoutes(
            <Route
                path="/admin"
                element={
                    <ProtectedRoute staffOnly>
                        <ProtectedContent />
                    </ProtectedRoute>
                }
            />,
            { initialEntries: ['/admin'] },
        );
        expect(
            screen.getByRole('heading', { name: /accès réservé/i }),
        ).toBeInTheDocument();
    });

    it("affiche un message si le compte n'est pas activé", () => {
        useAuth.mockReturnValue({
            user: {
                id: 1,
                email: 'pending@weeb.local',
                is_active: false,
                is_staff: false,
            },
            loading: false,
        });
        renderWithRoutes(
            <Route
                path="/prive"
                element={
                    <ProtectedRoute>
                        <ProtectedContent />
                    </ProtectedRoute>
                }
            />,
            { initialEntries: ['/prive'] },
        );
        expect(
            screen.getByRole('heading', { name: /attente de validation/i }),
        ).toBeInTheDocument();
    });
});
