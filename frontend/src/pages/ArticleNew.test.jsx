import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from 'react-router-dom';
import ArticleNew from './ArticleNew';
import { apiFetch } from '../api/client';
import { renderWithRoutes } from '../test/utils';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}));

describe('ArticleNew', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche le formulaire de création', () => {
        renderWithRoutes(
            <Route path="/blog/nouveau" element={<ArticleNew />} />,
            { initialEntries: ['/blog/nouveau'] },
        );

        expect(screen.getByRole('heading', { name: /nouvel article/i })).toBeInTheDocument();
        expect(screen.getByLabelText('Titre')).toBeInTheDocument();
        expect(screen.getByLabelText('Extrait')).toBeInTheDocument();
        expect(screen.getByLabelText('Contenu')).toBeInTheDocument();
    });

    it('publie un nouvel article', async () => {
        apiFetch.mockResolvedValueOnce({ id: 9 });
        const user = userEvent.setup();
        renderWithRoutes(
            <Route path="/blog/nouveau" element={<ArticleNew />} />,
            { initialEntries: ['/blog/nouveau'] },
        );

        await user.type(screen.getByLabelText('Titre'), 'Titre test');
        await user.type(screen.getByLabelText('Extrait'), 'Extrait test');
        await user.type(screen.getByLabelText('Contenu'), 'Contenu test');
        await user.click(screen.getByRole('button', { name: /publier/i }));

        expect(apiFetch).toHaveBeenCalledWith('/articles/', expect.objectContaining({
            method: 'POST',
            auth: true,
            isForm: true,
        }));
        const call = apiFetch.mock.calls[0][1];
        expect(call.body).toBeInstanceOf(FormData);
        expect(call.body.get('title')).toBe('Titre test');
        expect(call.body.get('excerpt')).toBe('Extrait test');
        expect(call.body.get('content')).toBe('Contenu test');
        expect(mockNavigate).toHaveBeenCalledWith('/blog/9');
    });
});
