import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

const initial = { title: '', excerpt: '', content: '', image: '' };

const ArticleNew = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const editId = params.get('edit');
    const [form, setForm] = useState(initial);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!editId) return;
        (async () => {
            try {
                const data = await apiFetch(`/articles/${editId}/`);
                setForm({
                    title: data.title || '',
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    image: data.image || '',
                });
            } catch (err) {
                setError(err.message || 'Article introuvable.');
            }
        })();
    }, [editId]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = { ...form };
            if (!payload.image) delete payload.image;
            if (editId) {
                await apiFetch(`/articles/${editId}/`, { method: 'PATCH', body: payload, auth: true });
                navigate(`/blog/${editId}`);
            } else {
                const created = await apiFetch('/articles/', { method: 'POST', body: payload, auth: true });
                navigate(`/blog/${created.id}`);
            }
        } catch (err) {
            setError(err.message || 'Erreur lors de la publication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='container-narrow article-form-container'>
            <h1 className='contact-title'>{editId ? "Modifier l'article" : 'Nouvel article'}</h1>
            <p className='contact-description'>Partagez vos découvertes avec la communauté Weeb.</p>

            <form className='contact-form' onSubmit={onSubmit}>
                {error && <div className='form-error'>{error}</div>}

                <div className='contact-form-group'>
                    <label htmlFor="title" className='contact-label'>Titre</label>
                    <input type="text" id="title" name="title" className='contact-input' value={form.title} onChange={onChange} required />
                </div>

                <div className='contact-form-group'>
                    <label htmlFor="excerpt" className='contact-label'>Extrait</label>
                    <input type="text" id="excerpt" name="excerpt" className='contact-input' value={form.excerpt} onChange={onChange} maxLength={280} required />
                </div>

                <div className='contact-form-group'>
                    <label htmlFor="image" className='contact-label'>URL de l'image (optionnel)</label>
                    <input type="url" id="image" name="image" className='contact-input' value={form.image} onChange={onChange} />
                </div>

                <div className='contact-form-group'>
                    <label htmlFor="content" className='contact-label'>Contenu</label>
                    <textarea id="content" name="content" rows="12" className='contact-textarea' value={form.content} onChange={onChange} required />
                </div>

                <button type="submit" className='contact-button' disabled={loading}>
                    {loading ? 'Publication…' : editId ? 'Enregistrer' : 'Publier'}
                </button>
            </form>
        </section>
    );
};

export default ArticleNew;
