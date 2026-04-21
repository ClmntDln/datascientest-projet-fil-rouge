import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AdminSubnav from '../components/AdminSubnav';

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const AdminUsers = () => {
    const { user: current } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busyId, setBusyId] = useState(null);

    const load = useCallback(async () => {
        setError('');
        try {
            const data = await apiFetch('/auth/admin/users/', { auth: true });
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Impossible de charger les utilisateurs.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const toggleActive = async (row) => {
        if (row.is_staff && !current?.is_superuser) return;
        const next = !row.is_active;
        if (!next && row.id === current?.id) return;
        setBusyId(row.id);
        setError('');
        try {
            const updated = await apiFetch(`/auth/admin/users/${row.id}/`, {
                method: 'PATCH',
                body: { is_active: next },
                auth: true,
            });
            setUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
        } catch (err) {
            setError(err.data?.detail || err.message || 'Action impossible.');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className='admin-container container-large'>
            <AdminSubnav />
            <header className='admin-header'>
                <div>
                    <h1 className='admin-title'>
                        Administration <span className="thin">utilisateurs</span>
                    </h1>
                    <p className='admin-description'>
                        Activez ou désactivez les comptes après inscription. Les comptes staff ne
                        peuvent être modifiés que par un superutilisateur.
                    </p>
                </div>
                <button type="button" className='admin-refresh' onClick={load} disabled={loading}>
                    Actualiser
                </button>
            </header>

            {loading && <p className='admin-empty'>Chargement…</p>}
            {error && <div className='form-error'>{error}</div>}

            {!loading && users.length > 0 && (
                <div className='admin-table-wrap'>
                    <table className='admin-table'>
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
                            {users.map((u) => {
                                const staffLocked = u.is_staff && !current?.is_superuser;
                                const disabled =
                                    busyId === u.id || (u.is_active && u.id === current?.id);
                                return (
                                    <tr key={u.id}>
                                        <td>
                                            {u.first_name} {u.last_name}
                                        </td>
                                        <td>{u.email}</td>
                                        <td className='admin-table-muted'>{formatDate(u.date_joined)}</td>
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
                                                    u.is_active ? 'admin-badge admin-badge-on' : 'admin-badge'
                                                }
                                            >
                                                {u.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className='admin-table-actions'>
                                            {staffLocked ? (
                                                <span className='admin-table-muted'>—</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className={
                                                        u.is_active
                                                            ? 'admin-toggle admin-toggle-off'
                                                            : 'admin-toggle admin-toggle-on'
                                                    }
                                                    disabled={disabled}
                                                    onClick={() => toggleActive(u)}
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

            {!loading && !error && users.length === 0 && (
                <p className='admin-empty'>Aucun utilisateur enregistré.</p>
            )}
        </section>
    );
};

export default AdminUsers;
