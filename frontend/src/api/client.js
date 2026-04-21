const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ACCESS_KEY = 'weeb_access';
const REFRESH_KEY = 'weeb_refresh';

export const tokenStore = {
    getAccess: () => localStorage.getItem(ACCESS_KEY),
    getRefresh: () => localStorage.getItem(REFRESH_KEY),
    set: (access, refresh) => {
        if (access) localStorage.setItem(ACCESS_KEY, access);
        if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    },
    clear: () => {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },
};

async function refreshAccess() {
    const refresh = tokenStore.getRefresh();
    if (!refresh) return null;
    const res = await fetch(`${API_URL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
        tokenStore.clear();
        return null;
    }
    const data = await res.json();
    tokenStore.set(data.access, null);
    return data.access;
}

export async function apiFetch(path, { method = 'GET', body, auth = false, isForm = false } = {}) {
    const headers = {};
    if (!isForm) headers['Content-Type'] = 'application/json';
    if (auth) {
        const token = tokenStore.getAccess();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const opts = {
        method,
        headers,
        body: isForm ? body : body ? JSON.stringify(body) : undefined,
    };

    let res = await fetch(`${API_URL}${path}`, opts);

    if (res.status === 401 && auth) {
        const newToken = await refreshAccess();
        if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            res = await fetch(`${API_URL}${path}`, { ...opts, headers });
        }
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
        const err = new Error(data?.detail || data?.message || 'Erreur API');
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

export { API_URL };
