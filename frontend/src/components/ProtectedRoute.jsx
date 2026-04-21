import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireActive = true }) => {
    const { user, loading } = useAuth();

    if (loading) return <p className='page-loading container-narrow'>Chargement…</p>;
    if (!user) return <Navigate to="/login" replace />;
    if (requireActive && !user.is_active) {
        return (
            <section className='container-narrow page-message'>
                <h1 className='page-message-title'>Compte en attente de validation</h1>
                <p>Votre compte a bien été créé. Un administrateur doit l'activer avant que vous puissiez publier un article.</p>
            </section>
        );
    }
    return children;
};

export default ProtectedRoute;
