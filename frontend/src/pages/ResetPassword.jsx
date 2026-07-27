import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import FormMessage from '../components/FormMessage';

const ResetPassword = () => {
    const { requestPasswordReset, confirmPasswordReset } = useAuth();
    const [params] = useSearchParams();
    const [step, setStep] = useState(1);
    const [requestForm, setRequestForm] = useState({ email: '' });
    const [confirmForm, setConfirmForm] = useState({
        uid: '',
        token: '',
        new_password: '',
        confirm: '',
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const uid = params.get('uid');
        const token = params.get('token');
        if (uid && token) {
            setConfirmForm((prev) => ({ ...prev, uid, token }));
            setStep(2);
        }
    }, [params]);

    const onSubmitRequest = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });
        setLoading(true);
        try {
            const data = await requestPasswordReset(requestForm.email);
            setStatus({
                type: 'success',
                msg:
                    data.detail ||
                    'Si un compte existe, un email de réinitialisation a été envoyé.',
            });
            if (data.reset_uid && data.reset_token) {
                setConfirmForm((prev) => ({
                    ...prev,
                    uid: data.reset_uid,
                    token: data.reset_token,
                }));
                setStep(2);
            }
        } catch (err) {
            const d = err.data;
            const msg =
                d?.email?.[0] ||
                d?.detail ||
                'Impossible de créer la demande de réinitialisation.';
            setStatus({ type: 'error', msg });
        } finally {
            setLoading(false);
        }
    };

    const onSubmitConfirm = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });
        if (confirmForm.new_password !== confirmForm.confirm) {
            setStatus({
                type: 'error',
                msg: 'Les mots de passe ne correspondent pas.',
            });
            return;
        }
        if (confirmForm.new_password.length < 8) {
            setStatus({
                type: 'error',
                msg: 'Le mot de passe doit contenir au moins 8 caractères.',
            });
            return;
        }
        setLoading(true);
        try {
            await confirmPasswordReset(
                confirmForm.uid,
                confirmForm.token,
                confirmForm.new_password,
            );
            setStatus({
                type: 'success',
                msg: 'Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.',
            });
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

    const showDevFields = import.meta.env.DEV && !params.get('uid');

    return (
        <section className="login-container container-narrow">
            <h1 className="login-title">Mot de passe oublié</h1>
            <p className="login-description">
                {step === 1
                    ? 'Saisissez votre email pour recevoir un lien de réinitialisation.'
                    : 'Définissez votre nouveau mot de passe.'}
            </p>

            <form
                className="login-form"
                onSubmit={step === 1 ? onSubmitRequest : onSubmitConfirm}
            >
                <FormMessage type={status.type} message={status.msg} />

                {step === 1 && (
                    <FormField
                        id="email"
                        label="Email"
                        type="email"
                        name="email"
                        value={requestForm.email}
                        onChange={(e) =>
                            setRequestForm({ email: e.target.value })
                        }
                        required
                    />
                )}

                {step === 2 && (
                    <>
                        {showDevFields && (
                            <>
                                <FormField
                                    id="uid"
                                    label="UID (dev)"
                                    value={confirmForm.uid}
                                    onChange={(e) =>
                                        setConfirmForm((prev) => ({
                                            ...prev,
                                            uid: e.target.value,
                                        }))
                                    }
                                    required
                                />
                                <FormField
                                    id="token"
                                    label="Token (dev)"
                                    value={confirmForm.token}
                                    onChange={(e) =>
                                        setConfirmForm((prev) => ({
                                            ...prev,
                                            token: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </>
                        )}
                        <FormField
                            id="new_password"
                            label="Nouveau mot de passe"
                            type="password"
                            value={confirmForm.new_password}
                            onChange={(e) =>
                                setConfirmForm((prev) => ({
                                    ...prev,
                                    new_password: e.target.value,
                                }))
                            }
                            required
                        />
                        <FormField
                            id="confirm"
                            label="Confirmation"
                            type="password"
                            value={confirmForm.confirm}
                            onChange={(e) =>
                                setConfirmForm((prev) => ({
                                    ...prev,
                                    confirm: e.target.value,
                                }))
                            }
                            required
                        />
                    </>
                )}

                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading
                        ? 'Envoi…'
                        : step === 1
                          ? 'Envoyer la demande'
                          : 'Réinitialiser'}
                </button>

                {step === 2 && (
                    <button
                        type="button"
                        className="login-button login-button-secondary"
                        onClick={() => {
                            setStep(1);
                            setStatus({ type: '', msg: '' });
                        }}
                        disabled={loading}
                    >
                        Refaire une demande
                    </button>
                )}

                <p className="login-signup">
                    <Link to="/login" className="login-signup-link">
                        Retour à la connexion
                    </Link>
                </p>
            </form>
        </section>
    );
};

export default ResetPassword;
