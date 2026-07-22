import { API_URL } from '../api/client';

export function mediaUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = API_URL.replace(/\/api\/?$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
