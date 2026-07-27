import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { API_URL, apiFetch, fetchSessionUser, markSession } from './client';

const SESSION_KEY = 'weeb_session';

function jsonResponse(body, { ok = true, status = ok ? 200 : 400 } = {}) {
    return {
        ok,
        status,
        text: () => Promise.resolve(JSON.stringify(body)),
        json: () => Promise.resolve(body),
    };
}

describe('markSession', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('pose le flag de session en sessionStorage', () => {
        markSession(true);
        expect(sessionStorage.getItem(SESSION_KEY)).toBe('1');
    });

    it('retire le flag de session en sessionStorage', () => {
        sessionStorage.setItem(SESSION_KEY, '1');
        markSession(false);
        expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    });
});

describe('fetchSessionUser', () => {
    beforeEach(() => {
        sessionStorage.clear();
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('retourne le profil et pose le flag si la requête réussit', async () => {
        fetch.mockResolvedValueOnce(
            jsonResponse({ id: 1, email: 'user@weeb.local' }),
        );

        const user = await fetchSessionUser();

        expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/me/`, {
            credentials: 'include',
        });
        expect(user).toEqual({ id: 1, email: 'user@weeb.local' });
        expect(sessionStorage.getItem(SESSION_KEY)).toBe('1');
    });

    it("ne tente pas de rafraîchir si aucun flag de session n'existe", async () => {
        fetch.mockResolvedValueOnce(
            jsonResponse(null, { ok: false, status: 401 }),
        );

        const user = await fetchSessionUser();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(user).toBeNull();
        expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    });

    it('tente un rafraîchissement puis relance la requête si le flag de session existe', async () => {
        sessionStorage.setItem(SESSION_KEY, '1');
        fetch
            .mockResolvedValueOnce(
                jsonResponse(null, { ok: false, status: 401 }),
            )
            .mockResolvedValueOnce(jsonResponse({}, { ok: true }))
            .mockResolvedValueOnce(
                jsonResponse({ id: 2, email: 'renouvele@weeb.local' }),
            );

        const user = await fetchSessionUser();

        expect(fetch).toHaveBeenCalledTimes(3);
        expect(fetch).toHaveBeenNthCalledWith(2, `${API_URL}/auth/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({}),
        });
        expect(user).toEqual({ id: 2, email: 'renouvele@weeb.local' });
        expect(sessionStorage.getItem(SESSION_KEY)).toBe('1');
    });

    it('retire le flag si le rafraîchissement échoue aussi', async () => {
        sessionStorage.setItem(SESSION_KEY, '1');
        fetch
            .mockResolvedValueOnce(
                jsonResponse(null, { ok: false, status: 401 }),
            )
            .mockResolvedValueOnce(
                jsonResponse(null, { ok: false, status: 401 }),
            );

        const user = await fetchSessionUser();

        expect(user).toBeNull();
        expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    });
});

describe('apiFetch', () => {
    beforeEach(() => {
        sessionStorage.clear();
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('envoie une requête JSON avec les credentials inclus', async () => {
        fetch.mockResolvedValueOnce(jsonResponse({ ok: true }));

        await apiFetch('/articles/', { method: 'POST', body: { title: 'A' } });

        expect(fetch).toHaveBeenCalledWith(`${API_URL}/articles/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title: 'A' }),
        });
    });

    it("n'ajoute pas de Content-Type pour un FormData", async () => {
        fetch.mockResolvedValueOnce(jsonResponse({ ok: true }));
        const formData = new FormData();

        await apiFetch('/articles/', {
            method: 'POST',
            body: formData,
            isForm: true,
        });

        const [, options] = fetch.mock.calls[0];
        expect(options.headers['Content-Type']).toBeUndefined();
        expect(options.body).toBe(formData);
    });

    it('relance la requête après un rafraîchissement réussi si auth est demandé', async () => {
        fetch
            .mockResolvedValueOnce(
                jsonResponse(null, { ok: false, status: 401 }),
            )
            .mockResolvedValueOnce(jsonResponse({}, { ok: true }))
            .mockResolvedValueOnce(jsonResponse({ id: 1 }));

        const data = await apiFetch('/auth/me/export/', { auth: true });

        expect(fetch).toHaveBeenCalledTimes(3);
        expect(data).toEqual({ id: 1 });
    });

    it("ne relance pas la requête sur 401 si auth n'est pas demandé", async () => {
        fetch.mockResolvedValueOnce(
            jsonResponse(
                { detail: 'Non autorisé.' },
                { ok: false, status: 401 },
            ),
        );

        await expect(apiFetch('/articles/')).rejects.toThrow('Non autorisé.');
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("lève une erreur avec le détail renvoyé par l'API", async () => {
        fetch.mockResolvedValueOnce(
            jsonResponse(
                { detail: 'Requête invalide.' },
                { ok: false, status: 400 },
            ),
        );

        let caughtError = null;
        try {
            await apiFetch('/contacts/');
        } catch (err) {
            caughtError = err;
        }

        expect(caughtError).not.toBeNull();
        expect(caughtError.message).toBe('Requête invalide.');
        expect(caughtError.status).toBe(400);
    });
});
