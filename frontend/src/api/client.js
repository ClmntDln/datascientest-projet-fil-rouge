const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function refreshAccess() {
    const res = await fetch(`${API_URL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
    });
    return res.ok;
}

export async function apiFetch(path, { method = 'GET', body, auth = false, isForm = false } = {}) {
    const headers = {};
    if (!isForm) headers['Content-Type'] = 'application/json';

    const opts = {
        method,
        headers,
        credentials: 'include',
        body: isForm ? body : body ? JSON.stringify(body) : undefined,
    };

    let res = await fetch(`${API_URL}${path}`, opts);

    if (res.status === 401 && auth) {
        if (await refreshAccess()) {
            res = await fetch(`${API_URL}${path}`, opts);
        }
    }

    const text = await res.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { detail: text };
        }
    }

    if (!res.ok) {
        const detail = data?.detail;
        const message = Array.isArray(detail) ? detail[0] : detail || data?.message || 'Erreur API';
        const err = new Error(typeof message === 'string' ? message : 'Erreur API');
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

export { API_URL };
