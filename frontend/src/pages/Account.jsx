import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormMessage from '../components/FormMessage';

const Account = () => {
    const { user, exportAccount, deleteAccount, logout } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState('');

    const handleExport = async () => {
        setLoading('export');
        setStatus({ type: '', msg: '' });
        try {
            const data = await exportAccount();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `weeb-export-${user.email}.json`;
            link.click();
            URL.revokeObjectURL(url);
            setStatus({ type: 'success', msg: 'Vos données ont été exportées.' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.message || 'Export impossible.' });
        } finally {
            setLoading('');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Supprimer définitivement votre compte et vos articles ?')) return;
        setLoading('delete');
        setStatus({ type: '', msg: '' });
        try {
            await deleteAccount();
            logout();
            navigate('/');
        } catch (err) {
            setStatus({ type: 'error', msg: err.message || 'Suppression impossible.' });
            setLoading('');
        }
    };

    return (
        <section className='login-container container-narrow'>
            <h1 className='login-title'>Mon compte</h1>
            <p className='login-description'>Gérez vos données personnelles conformément au RGPD.</p>

            <div className='account-info'>
                <p><strong>Nom :</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Statut :</strong> {user.is_active ? 'Compte actif' : 'En attente de validation'}</p>
            </div>

            <FormMessage type={status.type} message={status.msg} />

            <div className='article-actions account-actions'>
                <button
                    type="button"
                    className='login-button'
                    onClick={handleExport}
                    disabled={loading === 'export'}
                >
                    {loading === 'export' ? 'Export…' : 'Exporter mes données'}
                </button>
                {!user.is_staff && (
                    <button
                        type="button"
                        className='article-delete'
                        onClick={handleDelete}
                        disabled={loading === 'delete'}
                    >
                        {loading === 'delete' ? 'Suppression…' : 'Supprimer mon compte'}
                    </button>
                )}
            </div>

            <p className='login-signup'>
                Consultez notre <Link to="/confidentialite" className='login-signup-link'>politique de confidentialité</Link>.
            </p>
        </section>
    );
};

export default Account;
