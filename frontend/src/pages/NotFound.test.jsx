import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Route } from 'react-router-dom';
import NotFound from './NotFound';
import { renderWithRoutes } from '../test/utils';

describe('NotFound', () => {
    it("affiche la page 404 avec un lien vers l'accueil", () => {
        renderWithRoutes(
            <>
                <Route path="/" element={<div>Accueil</div>} />
                <Route path="*" element={<NotFound />} />
            </>,
            { initialEntries: ['/inexistant'] },
        );
        expect(
            screen.getByRole('heading', { name: '404' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /page introuvable/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: /retourner à l'accueil/i }),
        ).toHaveAttribute('href', '/');
    });
});
