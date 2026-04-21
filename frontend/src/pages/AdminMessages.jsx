import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import AdminSubnav from '../components/AdminSubnav';

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const AdminMessages = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setError('');
        try {
            const data = await apiFetch('/contacts/', { auth: true });
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Impossible de charger les messages.');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <section className='admin-container container-large'>
            <AdminSubnav />
            <header className='admin-header'>
                <div>
                    <h1 className='admin-title'>
                        Messages <span className="thin">de contact</span>
                    </h1>
                    <p className='admin-description'>
                        Messages reçus depuis le formulaire public. Les visiteurs ne reçoivent pas de
                        copie par e-mail automatique.
                    </p>
                </div>
                <button type="button" className='admin-refresh' onClick={load} disabled={loading}>
                    Actualiser
                </button>
            </header>

            {loading && <p className='admin-empty'>Chargement…</p>}
            {error && <div className='form-error'>{error}</div>}

            {!loading && items.length > 0 && (
                <ul className='admin-message-list'>
                    {items.map((m) => (
                        <li key={m.id} className='admin-message-card'>
                            <div className='admin-message-meta'>
                                <span className='admin-message-subject'>{m.subject}</span>
                                <span className='admin-table-muted'>{formatDate(m.created_at)}</span>
                            </div>
                            <p className='admin-message-from'>
                                {m.name} — <a href={`mailto:${m.email}`}>{m.email}</a>
                            </p>
                            <p className='admin-message-body'>{m.message}</p>
                        </li>
                    ))}
                </ul>
            )}

            {!loading && !error && items.length === 0 && (
                <p className='admin-empty'>Aucun message pour le moment.</p>
            )}
        </section>
    );
};

export default AdminMessages;
