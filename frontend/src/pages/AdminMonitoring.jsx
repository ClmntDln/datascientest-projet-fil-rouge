import { apiFetch } from '../api/client';
import { useAsyncData } from '../hooks/useAsyncData';
import AdminSubnav from '../components/AdminSubnav';
import AdminPageHeader from '../components/AdminPageHeader';
import FormMessage from '../components/FormMessage';

const formatPercent = (value) => `${(value * 100).toFixed(1)} %`;

const AdminMonitoring = () => {
    const { data, loading, error, reload } = useAsyncData(
        async () => {
            const [metrics, health] = await Promise.all([
                apiFetch('/monitoring/metrics/', { auth: true }),
                apiFetch('/health/'),
            ]);
            return { metrics, health };
        },
        [],
        { errorMessage: 'Impossible de charger les indicateurs.' },
    );

    const metrics = data?.metrics;
    const health = data?.health;
    const errorRateHigh = metrics && metrics.error_rate >= metrics.alerts.error_rate_threshold;
    const latencyHigh = metrics && metrics.p95_latency_ms >= metrics.alerts.latency_p95_threshold_ms;

    return (
        <section className='admin-container container-large'>
            <AdminSubnav />
            <AdminPageHeader
                title="Monitoring"
                accent="API"
                description="Indicateurs de performance et seuils d'alerte de l'API Weeb."
                onRefresh={reload}
                loading={loading}
            />

            {loading && <p className='admin-empty'>Chargement…</p>}
            <FormMessage message={error} />

            {!loading && metrics && (
                <>
                    <div className='admin-metrics-grid'>
                        <article className='admin-metric-card'>
                            <span className='admin-metric-label'>État API</span>
                            <span className={`admin-metric-value admin-metric-${health?.status === 'ok' ? 'ok' : 'warn'}`}>
                                {health?.status === 'ok' ? 'Opérationnel' : 'Dégradé'}
                            </span>
                            <span className='admin-table-muted'>Base : {health?.database}</span>
                        </article>
                        <article className='admin-metric-card'>
                            <span className='admin-metric-label'>Requêtes totales</span>
                            <span className='admin-metric-value'>{metrics.total_requests}</span>
                        </article>
                        <article className='admin-metric-card'>
                            <span className='admin-metric-label'>Taux d'erreur</span>
                            <span className={`admin-metric-value${errorRateHigh ? ' admin-metric-warn' : ''}`}>
                                {formatPercent(metrics.error_rate)}
                            </span>
                            <span className='admin-table-muted'>
                                Seuil : {formatPercent(metrics.alerts.error_rate_threshold)}
                            </span>
                        </article>
                        <article className='admin-metric-card'>
                            <span className='admin-metric-label'>Latence P95</span>
                            <span className={`admin-metric-value${latencyHigh ? ' admin-metric-warn' : ''}`}>
                                {metrics.p95_latency_ms} ms
                            </span>
                            <span className='admin-table-muted'>
                                Seuil : {metrics.alerts.latency_p95_threshold_ms} ms
                            </span>
                        </article>
                        <article className='admin-metric-card'>
                            <span className='admin-metric-label'>Latence moyenne</span>
                            <span className='admin-metric-value'>{metrics.avg_latency_ms} ms</span>
                        </article>
                        <article className='admin-metric-card'>
                            <span className='admin-metric-label'>Erreurs</span>
                            <span className='admin-metric-value'>{metrics.error_count}</span>
                        </article>
                    </div>

                    {Object.keys(metrics.status_codes).length > 0 && (
                        <div className='admin-table-wrap'>
                            <table className='admin-table'>
                                <thead>
                                    <tr>
                                        <th>Code HTTP</th>
                                        <th>Requêtes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(metrics.status_codes).map(([code, count]) => (
                                        <tr key={code}>
                                            <td>{code}</td>
                                            <td>{count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default AdminMonitoring;
