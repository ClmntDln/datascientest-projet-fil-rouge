import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import FormMessage from '../components/FormMessage';

const initial = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
};

const SignUp = () => {
    const { signup } = useAuth();
    const [form, setForm] = useState(initial);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

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
            const msg =
                d?.email?.[0] ||
                d?.password?.[0] ||
                d?.detail ||
                'Impossible de créer le compte.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <section className="login-container container-narrow page-message">
                <h1 className="login-title">Inscription réussie</h1>
                <p>
                    Votre compte a été créé. Un administrateur doit le valider
                    avant que vous puissiez publier des articles.
                </p>
                <p>
                    <Link to="/login" className="login-signup-link">
                        Retour à la connexion
                    </Link>
                </p>
            </section>
        );
    }

    return (
        <section className="login-container container-narrow">
            <h1 className="login-title">S'enregistrer</h1>
            <p className="login-description">
                Créez votre compte pour rejoindre la communauté Weeb.
            </p>

            <form className="login-form" onSubmit={onSubmit}>
                <FormMessage message={error} />

                <div className="form-row">
                    <FormField
                        id="first_name"
                        label="Prénom"
                        name="first_name"
                        value={form.first_name}
                        onChange={onChange}
                        required
                    />
                    <FormField
                        id="last_name"
                        label="Nom"
                        name="last_name"
                        value={form.last_name}
                        onChange={onChange}
                        required
                    />
                </div>

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

                <FormField
                    id="password2"
                    label="Confirmation"
                    type="password"
                    name="password2"
                    value={form.password2}
                    onChange={onChange}
                    required
                />

                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? 'Création…' : 'Créer mon compte'}
                </button>

                <p className="login-signup">
                    Déjà inscrit ?{' '}
                    <Link to="/login" className="login-signup-link">
                        Se connecter
                    </Link>
                </p>
            </form>
        </section>
    );
};

export default SignUp;
