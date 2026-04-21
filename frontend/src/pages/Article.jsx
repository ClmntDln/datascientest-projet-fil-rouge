import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

const Article = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await apiFetch(`/articles/${id}/`);
                setArticle(data);
            } catch (err) {
                setError(err.message || 'Article introuvable.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const onDelete = async () => {
        if (!window.confirm('Supprimer cet article ?')) return;
        try {
            await apiFetch(`/articles/${id}/`, { method: 'DELETE', auth: true });
            navigate('/blog');
        } catch (err) {
            setError(err.message || 'Suppression impossible.');
        }
    };

    if (loading) return <p className='page-loading container-narrow'>Chargement…</p>;
    if (error) return <div className='container-narrow form-error'>{error}</div>;
    if (!article) return null;

    const isOwner = user && article.author === user.id;

    return (
        <article className='article-container container-narrow'>
            <Link to="/blog" className='article-back'>← Tous les articles</Link>
            <h1 className='article-title'>{article.title}</h1>
            <div className='article-meta'>
                <span>{article.author_name}</span>
                <span>{formatDate(article.created_at)}</span>
            </div>
            {article.image && <div className='article-image'><img src={article.image} alt="" /></div>}
            <div className='article-content'>
                {article.content.split('\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>

            {isOwner && (
                <div className='article-actions'>
                    <Link to={`/blog/nouveau?edit=${article.id}`} className='login-button'>Modifier</Link>
                    <button type="button" className='article-delete' onClick={onDelete}>Supprimer</button>
                </div>
            )}
        </article>
    );
};

export default Article;
