import { useCallback } from 'react';
import { apiFetch } from '../api/client';
import { formatDate } from '../utils/formatDate';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSearchFilter } from '../hooks/useSearchFilter';
import AdminSubnav from '../components/AdminSubnav';
import AdminPageHeader from '../components/AdminPageHeader';
import FormMessage from '../components/FormMessage';

const AdminMessages = () => {
    const {
        data: items,
        loading,
        error,
        reload,
    } = useAsyncData(
        async () => {
            const data = await apiFetch('/contacts/', { auth: true });
            return Array.isArray(data) ? data : data.results || [];
        },
        [],
        { errorMessage: 'Impossible de charger les messages.' },
    );

    const getSearchText = useCallback(
        (m) => `${m.email} ${m.name} ${m.subject}`,
        [],
    );

    const { query, setQuery, filtered } = useSearchFilter(
        items ?? [],
        getSearchText,
    );

    return (
        <section className="admin-container container-large">
            <AdminSubnav />
            <AdminPageHeader
                title="Messages"
                accent="de contact"
                description="Messages reçus depuis le formulaire public."
                onRefresh={reload}
                loading={loading}
            />

            {loading && <p className="admin-empty">Chargement…</p>}
            <FormMessage message={error} />

            {!loading && items?.length > 0 && (
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Rechercher par nom, email ou sujet…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            )}

            {!loading && filtered.length > 0 && (
                <ul className="admin-message-list">
                    {filtered.map((m) => (
                        <li key={m.id} className="admin-message-card">
                            <div className="admin-message-meta">
                                <span className="admin-message-subject">
                                    {m.subject}
                                </span>
                                <span className="admin-table-muted">
                                    {formatDate(m.created_at, true)}
                                </span>
                            </div>
                            <p className="admin-message-from">
                                {m.name} —{' '}
                                <a href={`mailto:${m.email}`}>{m.email}</a>
                            </p>
                            <p className="admin-message-body">{m.message}</p>
                        </li>
                    ))}
                </ul>
            )}

            {!loading && !error && filtered.length === 0 && (
                <p className="admin-empty">
                    {query
                        ? 'Aucun résultat.'
                        : 'Aucun message pour le moment.'}
                </p>
            )}
        </section>
    );
};

export default AdminMessages;
