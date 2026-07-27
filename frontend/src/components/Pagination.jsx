const Pagination = ({ page, totalPages, loading, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="blog-pagination">
            <button
                type="button"
                className="admin-refresh"
                disabled={page <= 1 || loading}
                onClick={() => onPageChange(page - 1)}
            >
                Précédent
            </button>
            <span className="admin-table-muted">
                Page {page} / {totalPages}
            </span>
            <button
                type="button"
                className="admin-refresh"
                disabled={page >= totalPages || loading}
                onClick={() => onPageChange(page + 1)}
            >
                Suivant
            </button>
        </div>
    );
};

export default Pagination;
