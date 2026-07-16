import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Route } from 'react-router-dom';
import Privacy from './Privacy';
import { renderWithRoutes } from '../test/utils';

describe('Privacy', () => {
    it('affiche la politique de confidentialité', () => {
        renderWithRoutes(
            <>
                <Route path="/confidentialite" element={<Privacy />} />
                <Route path="/compte" element={<div>Compte</div>} />
                <Route path="/contact" element={<div>Contact</div>} />
            </>,
            { initialEntries: ['/confidentialite'] },
        );
        expect(screen.getByRole('heading', { name: /politique de confidentialité/i })).toBeInTheDocument();
        expect(screen.getByText(/RGPD/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /mon compte/i })).toHaveAttribute('href', '/compte');
    });
});
