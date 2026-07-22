const AdminPageHeader = ({ title, accent, description, onRefresh, loading }) => (
    <header className='admin-header'>
        <div>
            <h1 className='admin-title'>
                {title} {accent && <span className="thin">{accent}</span>}
            </h1>
            <p className='admin-description'>{description}</p>
        </div>
        <button type="button" className='admin-refresh' onClick={onRefresh} disabled={loading}>
            Actualiser
        </button>
    </header>
);

export default AdminPageHeader;
