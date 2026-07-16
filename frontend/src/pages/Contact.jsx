import { useState } from 'react';
import { apiFetch } from '../api/client';

const initial = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
    const [form, setForm] = useState(initial);
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
            setStatus({ type: 'success', msg: 'Votre message a bien été envoyé. Merci !' });
            setForm(initial);
            setConsent(false);
        } catch (err) {
            setStatus({ type: 'error', msg: err.message || 'Une erreur est survenue.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='contact-container container-narrow'>
            <h1 className='contact-title'>Votre avis compte !</h1>
            <p className='contact-description'>Votre retour est essentiel pour nous améliorer ! Partagez votre expérience, dites-nous ce que vous aimez et ce que nous pourrions améliorer.</p>

            <form className='contact-form' onSubmit={onSubmit}>
                {status.msg && <div className={status.type === 'success' ? 'form-success' : 'form-error'}>{status.msg}</div>}

                <div className='contact-form-group'>
                    <label htmlFor="name" className='contact-label'>Nom</label>
                    <input type="text" id="name" name="name" className='contact-input' value={form.name} onChange={onChange} placeholder="Votre nom" required />
                </div>

                <div className='contact-form-group'>
                    <label htmlFor="email" className='contact-label'>Email</label>
                    <input type="email" id="email" name="email" className='contact-input' value={form.email} onChange={onChange} required />
                </div>

                <div className='contact-form-group'>
                    <label htmlFor="subject" className='contact-label'>Sujet</label>
                    <input type="text" id="subject" name="subject" className='contact-input' value={form.subject} onChange={onChange} required />
                </div>

                <div className='contact-form-group'>
                    <label htmlFor="message" className='contact-label'>Message</label>
                    <textarea id="message" name="message" rows="6" className='contact-textarea' value={form.message} onChange={onChange} required />
                </div>

                <label className='login-checkbox-label'>
                    <input
                        type="checkbox"
                        className='login-checkbox'
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                    />
                    J'accepte le traitement de mes données personnelles.
                </label>

                <button type="submit" className='contact-button' disabled={loading}>
                    {loading ? 'Envoi…' : 'Envoyer le message'}
                </button>
            </form>
        </section>
    );
};

export default Contact;
