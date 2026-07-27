import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './Home';
import { renderWithRouter } from '../test/utils';

describe('Home', () => {
    it('affiche le titre principal et les liens vers le blog', () => {
        renderWithRouter(<Home />, { route: '/', path: '/' });

        expect(
            screen.getByRole('heading', { level: 1, name: /explorez le web/i }),
        ).toBeInTheDocument();

        const blogLinks = screen.getAllByRole('link', {
            name: /(découvrir les articles|explorer les ressources|lire les articles récents|découvrir le blog)/i,
        });
        expect(blogLinks.length).toBeGreaterThan(0);
        blogLinks.forEach((link) => {
            expect(link).toHaveAttribute('href', '/blog');
        });
    });

    it('affiche la section newsletter', () => {
        renderWithRouter(<Home />, { route: '/', path: '/' });
        expect(
            screen.getByRole('heading', { name: 'Restez informé' }),
        ).toBeInTheDocument();
    });
});
