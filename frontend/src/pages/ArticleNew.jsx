import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { mediaUrl } from '../utils/media';
import { useAsyncData } from '../hooks/useAsyncData';
import FormField from '../components/FormField';
import FormMessage from '../components/FormMessage';

const initial = { title: '', excerpt: '', content: '' };

const ArticleNew = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const editId = params.get('edit');
    const [form, setForm] = useState(initial);
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [blobPreview, setBlobPreview] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);

    const { error: loadError } = useAsyncData(
        async () => {
            const data = await apiFetch(`/articles/${editId}/`);
            setForm({
                title: data.title || '',
                excerpt: data.excerpt || '',
                content: data.content || '',
            });
            setExistingImage(data.image ? mediaUrl(data.image) : '');
            return data;
        },
        [editId],
        { enabled: !!editId, errorMessage: 'Article introuvable.' },
    );

    useEffect(() => {
        return () => {
            if (blobPreview) URL.revokeObjectURL(blobPreview);
        };
    }, [blobPreview]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onImageChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
        setBlobPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return file ? URL.createObjectURL(file) : '';
        });
    };

    const imagePreview = blobPreview || existingImage;

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('excerpt', form.excerpt);
            fd.append('content', form.content);
            if (imageFile) fd.append('image', imageFile);

            if (editId) {
                await apiFetch(`/articles/${editId}/`, { method: 'PATCH', body: fd, auth: true, isForm: true });
                navigate(`/blog/${editId}`);
            } else {
                const created = await apiFetch('/articles/', { method: 'POST', body: fd, auth: true, isForm: true });
                navigate(`/blog/${created.id}`);
            }
        } catch (err) {
            setSubmitError(err.message || 'Erreur lors de la publication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='container-narrow article-form-container'>
            <h1 className='contact-title'>{editId ? "Modifier l'article" : 'Nouvel article'}</h1>
            <p className='contact-description'>Partagez vos découvertes avec la communauté Weeb.</p>

            <form className='contact-form' onSubmit={onSubmit}>
                <FormMessage message={loadError || submitError} />

                <FormField
                    id="title"
                    label="Titre"
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    required
                />

                <FormField
                    id="excerpt"
                    label="Extrait"
                    name="excerpt"
                    value={form.excerpt}
                    onChange={onChange}
                    maxLength={280}
                    required
                />

                <FormField
                    id="image"
                    label="Image (optionnel)"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={onImageChange}
                >
                    {imagePreview && (
                        <img src={imagePreview} alt="Aperçu" className='article-form-preview' />
                    )}
                </FormField>

                <FormField
                    id="content"
                    label="Contenu"
                    as="textarea"
                    name="content"
                    rows={12}
                    value={form.content}
                    onChange={onChange}
                    required
                />

                <button type="submit" className='contact-button' disabled={loading}>
                    {loading ? 'Publication…' : editId ? 'Enregistrer' : 'Publier'}
                </button>
            </form>
        </section>
    );
};

export default ArticleNew;
