import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../hooks/useAuth';

const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

const Blog = () => {
    const { user } = useAuth();
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError('');
            try {
                const data = await apiFetch(`/articles/?page=${page}`);
                if (Array.isArray(data)) {
                    setArticles(data);
                    setTotalPages(1);
                } else {
                    setArticles(data.results || []);
                    setTotalPages(Math.max(1, Math.ceil((data.count || 0) / 20)));
                }
            } catch (err) {
                setError(err.message || 'Impossible de charger les articles.');
            } finally {
                setLoading(false);
            }
        })();
    }, [page]);

    return (
        <section className='blog-container container-large'>
            <div className='blog-header'>
                <div>
                    <h1 className='blog-title'>Le blog <span className="thin">Weeb</span></h1>
                    <p className='blog-description'>Actualités, tutoriels et tendances du web par nos contributeurs.</p>
                </div>
                {user?.is_active && (
                    <Link to="/blog/nouveau" className='blog-new-button'>Écrire un article</Link>
                )}
            </div>

            {loading && <p className='blog-empty'>Chargement…</p>}
            {error && <div className='form-error'>{error}</div>}
            {!loading && !error && articles.length === 0 && (
                <p className='blog-empty'>Aucun article publié pour le moment.</p>
            )}

            <div className='blog-grid'>
                {articles.map((a) => (
                    <article key={a.id} className='blog-card'>
                        {a.image && (
                            <div className='blog-card-image'>
                                <img src={a.image} alt={a.title} loading="lazy" />
                            </div>
                        )}
                        <div className='blog-card-body'>
                            <h2 className='blog-card-title'>
                                <Link to={`/blog/${a.id}`}>{a.title}</Link>
                            </h2>
                            <p className='blog-card-excerpt'>{a.excerpt}</p>
                            <div className='blog-card-meta'>
                                <span>{a.author_name || 'Anonyme'}</span>
                                <span>{formatDate(a.created_at)}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {totalPages > 1 && (
                <div className='blog-pagination'>
                    <button
                        type="button"
                        className='admin-refresh'
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Précédent
                    </button>
                    <span className='admin-table-muted'>Page {page} / {totalPages}</span>
                    <button
                        type="button"
                        className='admin-refresh'
                        disabled={page >= totalPages || loading}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </section>
    );
};

export default Blog;
