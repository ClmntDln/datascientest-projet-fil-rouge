import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import { parsePaginated } from '../utils/pagination';
import { mediaUrl } from '../utils/media';
import { useAsyncData } from '../hooks/useAsyncData';
import Pagination from '../components/Pagination';
import FormMessage from '../components/FormMessage';

const Blog = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);

    const { data, loading, error } = useAsyncData(
        async () => {
            const raw = await apiFetch(`/articles/?page=${page}`);
            return parsePaginated(raw);
        },
        [page],
        { errorMessage: 'Impossible de charger les articles.' },
    );

    const articles = data?.items ?? [];
    const totalPages = data?.totalPages ?? 1;

    return (
        <section className="blog-container container-large">
            <div className="blog-header">
                <div>
                    <h1 className="blog-title">
                        Le blog <span className="thin">Weeb</span>
                    </h1>
                    <p className="blog-description">
                        Actualités, tutoriels et tendances du web par nos
                        contributeurs.
                    </p>
                </div>
                {user?.is_active && (
                    <Link to="/blog/nouveau" className="blog-new-button">
                        Écrire un article
                    </Link>
                )}
            </div>

            {loading && <p className="blog-empty">Chargement…</p>}
            <FormMessage message={error} />
            {!loading && !error && articles.length === 0 && (
                <p className="blog-empty">
                    Aucun article publié pour le moment.
                </p>
            )}

            <div className="blog-grid">
                {articles.map((a) => (
                    <article key={a.id} className="blog-card">
                        {a.image && (
                            <div className="blog-card-image">
                                <img
                                    src={mediaUrl(a.image)}
                                    alt={a.title}
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <div className="blog-card-body">
                            <h2 className="blog-card-title">
                                <Link to={`/blog/${a.id}`}>{a.title}</Link>
                            </h2>
                            <p className="blog-card-excerpt">{a.excerpt}</p>
                            <div className="blog-card-meta">
                                <span>{a.author_name || 'Anonyme'}</span>
                                <span>{formatDate(a.created_at)}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                loading={loading}
                onPageChange={setPage}
            />
        </section>
    );
};

export default Blog;
