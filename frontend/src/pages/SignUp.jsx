import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initial = { first_name: '', last_name: '', email: '', password: '', password2: '' };

const SignUp = () => {
    const { signup } = useAuth();
    const [form, setForm] = useState(initial);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.password2) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (form.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        setLoading(true);
        try {
            await signup({
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                password: form.password,
            });
            setSuccess(true);
            setForm(initial);
        } catch (err) {
            const d = err.data;
            const msg = d?.email?.[0] || d?.password?.[0] || d?.detail || 'Impossible de créer le compte.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <section className='login-container container-narrow page-message'>
                <h1 className='login-title'>Inscription réussie</h1>
                <p>Votre compte a été créé. Un administrateur doit le valider avant que vous puissiez publier des articles.</p>
                <p><Link to="/login" className='login-signup-link'>Retour à la connexion</Link></p>
            </section>
        );
    }

    return (
        <section className='login-container container-narrow'>
            <h1 className='login-title'>S'enregistrer</h1>
            <p className='login-description'>Créez votre compte pour rejoindre la communauté Weeb.</p>

            <form className='login-form' onSubmit={onSubmit}>
                {error && <div className='form-error'>{error}</div>}

                <div className='form-row'>
                    <div className='login-form-group'>
                        <label htmlFor="first_name" className='login-label'>Prénom</label>
                        <input type="text" id="first_name" name="first_name" className='login-input' value={form.first_name} onChange={onChange} required />
                    </div>
                    <div className='login-form-group'>
                        <label htmlFor="last_name" className='login-label'>Nom</label>
                        <input type="text" id="last_name" name="last_name" className='login-input' value={form.last_name} onChange={onChange} required />
                    </div>
                </div>

                <div className='login-form-group'>
                    <label htmlFor="email" className='login-label'>Email</label>
                    <input type="email" id="email" name="email" className='login-input' value={form.email} onChange={onChange} required />
                </div>

                <div className='login-form-group'>
                    <label htmlFor="password" className='login-label'>Mot de passe</label>
                    <input type="password" id="password" name="password" className='login-input' value={form.password} onChange={onChange} required />
                </div>

                <div className='login-form-group'>
                    <label htmlFor="password2" className='login-label'>Confirmation</label>
                    <input type="password" id="password2" name="password2" className='login-input' value={form.password2} onChange={onChange} required />
                </div>

                <button type="submit" className='login-button' disabled={loading}>
                    {loading ? 'Création…' : 'Créer mon compte'}
                </button>

                <p className='login-signup'>
                    Déjà inscrit ? <Link to="/login" className='login-signup-link'>Se connecter</Link>
                </p>
            </form>
        </section>
    );
};

export default SignUp;
