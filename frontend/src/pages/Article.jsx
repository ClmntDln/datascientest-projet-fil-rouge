import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import { mediaUrl } from '../utils/media';
import { useAsyncData } from '../hooks/useAsyncData';
import FormMessage from '../components/FormMessage';
import PageLoader from '../components/PageLoader';

const Article = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [deleteError, setDeleteError] = useState('');

    const {
        data: article,
        loading,
        error,
    } = useAsyncData(() => apiFetch(`/articles/${id}/`), [id], {
        errorMessage: 'Article introuvable.',
    });

    const onDelete = async () => {
        if (!window.confirm('Supprimer cet article ?')) return;
        setDeleteError('');
        try {
            await apiFetch(`/articles/${id}/`, {
                method: 'DELETE',
                auth: true,
            });
            navigate('/blog');
        } catch (err) {
            setDeleteError(err.message || 'Suppression impossible.');
        }
    };

    if (loading) return <PageLoader />;
    if (error)
        return (
            <div className="container-narrow">
                <FormMessage message={error} />
            </div>
        );
    if (!article) return null;

    const isOwner = user && article.author === user.id;

    return (
        <article className="article-container container-narrow">
            <Link to="/blog" className="article-back">
                ← Tous les articles
            </Link>
            <h1 className="article-title">{article.title}</h1>
            <div className="article-meta">
                <span>{article.author_name}</span>
                <span>{formatDate(article.created_at)}</span>
            </div>
            {article.image && (
                <div className="article-image">
                    <img src={mediaUrl(article.image)} alt={article.title} />
                </div>
            )}
            <div className="article-content">
                {article.content.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                ))}
            </div>

            <FormMessage message={deleteError} />

            {isOwner && (
                <div className="article-actions">
                    <Link
                        to={`/blog/nouveau?edit=${article.id}`}
                        className="login-button"
                    >
                        Modifier
                    </Link>
                    <button
                        type="button"
                        className="article-delete"
                        onClick={onDelete}
                    >
                        Supprimer
                    </button>
                </div>
            )}
        </article>
    );
};

export default Article;
