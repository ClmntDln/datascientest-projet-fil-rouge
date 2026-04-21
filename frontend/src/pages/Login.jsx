import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            const to = location.state?.from || '/';
            navigate(to, { replace: true });
        } catch (err) {
            setError(err.data?.detail || 'Identifiants invalides ou compte non activé.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='login-container container-narrow'>
            <h1 className='login-title'>Connexion</h1>
            <p className='login-description'>Connectez-vous à votre compte pour accéder à toutes les fonctionnalités.</p>

            <form className='login-form' onSubmit={onSubmit}>
                {error && <div className='form-error'>{error}</div>}

                <div className='login-form-group'>
                    <label htmlFor="email" className='login-label'>Email</label>
                    <input type="email" id="email" name="email" className='login-input' value={form.email} onChange={onChange} required />
                </div>

                <div className='login-form-group'>
                    <label htmlFor="password" className='login-label'>Mot de passe</label>
                    <input type="password" id="password" name="password" className='login-input' value={form.password} onChange={onChange} required />
                </div>

                <div className='login-form-options'>
                    <label className='login-checkbox-label'>
                        <input type="checkbox" className='login-checkbox' />
                        Se souvenir de moi
                    </label>
                    <Link to="/reset-password" className='login-forgot-link'>Mot de passe oublié ?</Link>
                </div>

                <button type="submit" className='login-button' disabled={loading}>
                    {loading ? 'Connexion…' : 'Se connecter'}
                </button>

                <p className='login-signup'>
                    Pas encore de compte ? <Link to="/signup" className='login-signup-link'>Créer un compte</Link>
                </p>
            </form>
        </section>
    );
};

export default Login;
