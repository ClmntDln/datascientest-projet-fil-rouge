import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import FormMessage from '../components/FormMessage';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem('weeb_remembered_email');
        if (savedEmail) {
            setForm((f) => ({ ...f, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            if (rememberMe) {
                localStorage.setItem('weeb_remembered_email', form.email);
            } else {
                localStorage.removeItem('weeb_remembered_email');
            }
            const to = location.state?.from || '/';
            navigate(to, { replace: true });
        } catch (err) {
            const detail = err.data?.detail;
            setError(
                (Array.isArray(detail) ? detail[0] : detail)
                || err.message
                || 'Identifiants invalides ou compte non activé.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='login-container container-narrow'>
            <h1 className='login-title'>Connexion</h1>
            <p className='login-description'>Connectez-vous à votre compte pour accéder à toutes les fonctionnalités.</p>

            <form className='login-form' onSubmit={onSubmit}>
                <FormMessage message={error} />

                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                />

                <FormField
                    id="password"
                    label="Mot de passe"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    required
                />

                <div className='login-form-options'>
                    <label className='login-checkbox-label'>
                        <input
                            type="checkbox"
                            className='login-checkbox'
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
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
