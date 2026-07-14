import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
    const { requestPasswordReset, confirmPasswordReset } = useAuth();
    const [step, setStep] = useState(1);
    const [requestForm, setRequestForm] = useState({ email: '' });
    const [confirmForm, setConfirmForm] = useState({ uid: '', token: '', new_password: '', confirm: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const onSubmitRequest = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });
        setLoading(true);
        try {
            const data = await requestPasswordReset(requestForm.email);
            setStatus({
                type: 'success',
                msg: data.detail || 'Demande envoyée. Vérifiez vos emails.',
            });
            setStep(2);
            if (data.reset_uid && data.reset_token) {
                setConfirmForm((prev) => ({
                    ...prev,
                    uid: data.reset_uid,
                    token: data.reset_token,
                }));
            }
        } catch (err) {
            const d = err.data;
            const msg = d?.email?.[0] || d?.detail || 'Impossible de créer la demande de réinitialisation.';
            setStatus({ type: 'error', msg });
        } finally {
            setLoading(false);
        }
    };

    const onSubmitConfirm = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });
        if (confirmForm.new_password !== confirmForm.confirm) {
            setStatus({ type: 'error', msg: 'Les mots de passe ne correspondent pas.' });
            return;
        }
        if (confirmForm.new_password.length < 8) {
            setStatus({ type: 'error', msg: 'Le mot de passe doit contenir au moins 8 caractères.' });
            return;
        }
        setLoading(true);
        try {
            await confirmPasswordReset(confirmForm.uid, confirmForm.token, confirmForm.new_password);
            setStatus({ type: 'success', msg: 'Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.' });
            setConfirmForm({ uid: '', token: '', new_password: '', confirm: '' });
        } catch (err) {
            const d = err.data;
            const msg =
                d?.token?.[0] ||
                d?.new_password?.[0] ||
                d?.detail ||
                'Impossible de confirmer la réinitialisation.';
            setStatus({ type: 'error', msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='login-container container-narrow'>
            <h1 className='login-title'>Mot de passe oublié</h1>
            <p className='login-description'>
                {step === 1
                    ? 'Saisissez votre email pour recevoir un lien de réinitialisation.'
                    : 'Renseignez le code reçu pour définir votre nouveau mot de passe.'}
            </p>

            <form className='login-form' onSubmit={step === 1 ? onSubmitRequest : onSubmitConfirm}>
                {status.msg && <div className={status.type === 'success' ? 'form-success' : 'form-error'}>{status.msg}</div>}

                <div className='login-form-group'>
                    <label htmlFor="email" className='login-label'>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className='login-input'
                        value={requestForm.email}
                        onChange={(e) => setRequestForm({ email: e.target.value })}
                        required
                        disabled={step === 2}
                    />
                </div>

                {step === 2 && (
                    <>
                        <div className='login-form-group'>
                            <label htmlFor="uid" className='login-label'>UID</label>
                            <input
                                type="text"
                                id="uid"
                                name="uid"
                                className='login-input'
                                value={confirmForm.uid}
                                onChange={(e) => setConfirmForm((prev) => ({ ...prev, uid: e.target.value }))}
                                required
                            />
                        </div>

                        <div className='login-form-group'>
                            <label htmlFor="token" className='login-label'>Token</label>
                            <input
                                type="text"
                                id="token"
                                name="token"
                                className='login-input'
                                value={confirmForm.token}
                                onChange={(e) => setConfirmForm((prev) => ({ ...prev, token: e.target.value }))}
                                required
                            />
                        </div>

                        <div className='login-form-group'>
                            <label htmlFor="new_password" className='login-label'>Nouveau mot de passe</label>
                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                className='login-input'
                                value={confirmForm.new_password}
                                onChange={(e) => setConfirmForm((prev) => ({ ...prev, new_password: e.target.value }))}
                                required
                            />
                        </div>

                        <div className='login-form-group'>
                            <label htmlFor="confirm" className='login-label'>Confirmation</label>
                            <input
                                type="password"
                                id="confirm"
                                name="confirm"
                                className='login-input'
                                value={confirmForm.confirm}
                                onChange={(e) => setConfirmForm((prev) => ({ ...prev, confirm: e.target.value }))}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit" className='login-button' disabled={loading}>
                    {loading ? 'Envoi…' : step === 1 ? 'Envoyer la demande' : 'Réinitialiser'}
                </button>

                {step === 2 && (
                    <button
                        type="button"
                        className='login-button login-button-secondary'
                        onClick={() => {
                            setStep(1);
                            setStatus({ type: '', msg: '' });
                        }}
                        disabled={loading}
                    >
                        Refaire une demande
                    </button>
                )}

                <p className='login-signup'>
                    <Link to="/login" className='login-signup-link'>Retour à la connexion</Link>
                </p>
            </form>
        </section>
    );
};

export default ResetPassword;
