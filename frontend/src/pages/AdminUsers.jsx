import { useCallback, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSearchFilter } from '../hooks/useSearchFilter';
import AdminSubnav from '../components/AdminSubnav';
import AdminPageHeader from '../components/AdminPageHeader';
import FormMessage from '../components/FormMessage';

const AdminUsers = () => {
    const { user: current } = useAuth();
    const [busyId, setBusyId] = useState(null);
    const [actionError, setActionError] = useState('');

    const {
        data: users,
        setData: setUsers,
        loading,
        error,
        reload,
    } = useAsyncData(
        async () => {
            const data = await apiFetch('/auth/admin/users/', { auth: true });
            return Array.isArray(data) ? data : data.results || [];
        },
        [],
        { errorMessage: 'Impossible de charger les utilisateurs.' },
    );

    const getSearchText = useCallback(
        (u) => `${u.email} ${u.first_name} ${u.last_name}`,
        [],
    );

    const { query, setQuery, filtered } = useSearchFilter(
        users ?? [],
        getSearchText,
    );

    const toggleActive = async (row) => {
        if (row.is_staff && !current?.is_superuser) return;
        const next = !row.is_active;
        if (!next && row.id === current?.id) return;
        setBusyId(row.id);
        setActionError('');
        try {
            const updated = await apiFetch(`/auth/admin/users/${row.id}/`, {
                method: 'PATCH',
                body: { is_active: next },
                auth: true,
            });
            setUsers((list) =>
                list.map((u) => (u.id === updated.id ? updated : u)),
            );
        } catch (err) {
            setActionError(
                err.data?.detail || err.message || 'Action impossible.',
            );
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className="admin-container container-large">
            <AdminSubnav />
            <AdminPageHeader
                title="Administration"
                accent="utilisateurs"
                description="Activez ou désactivez les comptes après inscription. Les comptes staff ne peuvent être modifiés que par un superutilisateur."
                onRefresh={reload}
                loading={loading}
            />

            {loading && <p className="admin-empty">Chargement…</p>}
            <FormMessage message={error || actionError} />

            {!loading && users?.length > 0 && (
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Rechercher par nom ou email…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            )}

            {!loading && filtered.length > 0 && (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Inscription</th>
                                <th>Rôle</th>
                                <th>Statut</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => {
                                const staffLocked =
                                    u.is_staff && !current?.is_superuser;
                                const disabled =
                                    busyId === u.id ||
                                    (u.is_active && u.id === current?.id);
                                return (
                                    <tr key={u.id}>
                                        <td>
                                            {u.first_name} {u.last_name}
                                        </td>
                                        <td>{u.email}</td>
                                        <td className="admin-table-muted">
                                            {formatDate(u.date_joined, true)}
                                        </td>
                                        <td>
                                            {u.is_superuser
                                                ? 'Superutilisateur'
                                                : u.is_staff
                                                  ? 'Staff'
                                                  : 'Utilisateur'}
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    u.is_active
                                                        ? 'admin-badge admin-badge-on'
                                                        : 'admin-badge'
                                                }
                                            >
                                                {u.is_active
                                                    ? 'Actif'
                                                    : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="admin-table-actions">
                                            {staffLocked ? (
                                                <span className="admin-table-muted">
                                                    —
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className={
                                                        u.is_active
                                                            ? 'admin-toggle admin-toggle-off'
                                                            : 'admin-toggle admin-toggle-on'
                                                    }
                                                    disabled={disabled}
                                                    onClick={() =>
                                                        toggleActive(u)
                                                    }
                                                >
                                                    {busyId === u.id
                                                        ? '…'
                                                        : u.is_active
                                                          ? 'Désactiver'
                                                          : 'Activer'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <p className="admin-empty">
                    {query
                        ? 'Aucun résultat.'
                        : 'Aucun utilisateur enregistré.'}
                </p>
            )}
        </section>
    );
};

export default AdminUsers;
