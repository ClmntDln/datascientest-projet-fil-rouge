import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
    const { resetPassword } = useAuth();
    const [form, setForm] = useState({ email: '', new_password: '', confirm: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });
        if (form.new_password !== form.confirm) {
            setStatus({ type: 'error', msg: 'Les mots de passe ne correspondent pas.' });
            return;
        }
        if (form.new_password.length < 8) {
            setStatus({ type: 'error', msg: 'Le mot de passe doit contenir au moins 8 caractères.' });
            return;
        }
        setLoading(true);
        try {
            await resetPassword(form.email, form.new_password);
            setStatus({ type: 'success', msg: 'Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.' });
            setForm({ email: '', new_password: '', confirm: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.data?.detail || 'Impossible de réinitialiser le mot de passe.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='login-container container-narrow'>
            <h1 className='login-title'>Mot de passe oublié</h1>
            <p className='login-description'>Saisissez votre email et choisissez un nouveau mot de passe.</p>

            <form className='login-form' onSubmit={onSubmit}>
                {status.msg && <div className={status.type === 'success' ? 'form-success' : 'form-error'}>{status.msg}</div>}

                <div className='login-form-group'>
                    <label htmlFor="email" className='login-label'>Email</label>
                    <input type="email" id="email" name="email" className='login-input' value={form.email} onChange={onChange} required />
                </div>

                <div className='login-form-group'>
                    <label htmlFor="new_password" className='login-label'>Nouveau mot de passe</label>
                    <input type="password" id="new_password" name="new_password" className='login-input' value={form.new_password} onChange={onChange} required />
                </div>

                <div className='login-form-group'>
                    <label htmlFor="confirm" className='login-label'>Confirmation</label>
                    <input type="password" id="confirm" name="confirm" className='login-input' value={form.confirm} onChange={onChange} required />
                </div>

                <button type="submit" className='login-button' disabled={loading}>
                    {loading ? 'Envoi…' : 'Réinitialiser'}
                </button>

                <p className='login-signup'>
                    <Link to="/login" className='login-signup-link'>Retour à la connexion</Link>
                </p>
            </form>
        </section>
    );
};

export default ResetPassword;
