import { useState } from 'react';
import { apiFetch } from '../api/client';
import FormField from '../components/FormField';
import FormMessage from '../components/FormMessage';

const initial = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
    const [form, setForm] = useState(initial);
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!consent) {
            setStatus({
                type: 'error',
                msg: 'Vous devez accepter le traitement de vos données personnelles.',
            });
            return;
        }
        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            await apiFetch('/contacts/', {
                method: 'POST',
                body: { ...form, consent_given: true },
            });
            setStatus({
                type: 'success',
                msg: 'Votre message a bien été envoyé. Merci !',
            });
            setForm(initial);
            setConsent(false);
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.message || 'Une erreur est survenue.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="contact-container container-narrow">
            <h1 className="contact-title">Votre avis compte !</h1>
            <p className="contact-description">
                Votre retour est essentiel pour nous améliorer ! Partagez votre
                expérience, dites-nous ce que vous aimez et ce que nous
                pourrions améliorer.
            </p>

            <form className="contact-form" onSubmit={onSubmit}>
                <FormMessage type={status.type} message={status.msg} />

                <FormField
                    id="name"
                    label="Nom"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Votre nom"
                    required
                />

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
                    id="subject"
                    label="Sujet"
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    required
                />

                <FormField
                    id="message"
                    label="Message"
                    as="textarea"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={onChange}
                    required
                />

                <label className="login-checkbox-label">
                    <input
                        type="checkbox"
                        className="login-checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                    />
                    J'accepte le traitement de mes données personnelles.
                </label>

                <button
                    type="submit"
                    className="contact-button"
                    disabled={loading}
                >
                    {loading ? 'Envoi…' : 'Envoyer le message'}
                </button>
            </form>
        </section>
    );
};

export default Contact;
