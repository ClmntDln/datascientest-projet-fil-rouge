import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminMonitoring from './AdminMonitoring';
import { apiFetch } from '../api/client';
import { renderWithRouter } from '../test/utils';

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}));

describe('AdminMonitoring', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche les indicateurs de monitoring', async () => {
        apiFetch.mockImplementation((path) => {
            if (path === '/monitoring/metrics/') {
                return Promise.resolve({
                    total_requests: 42,
                    error_count: 2,
                    error_rate: 0.0476,
                    avg_latency_ms: 85.5,
                    p95_latency_ms: 210,
                    status_codes: { '200': 40, '500': 2 },
                    alerts: {
                        error_rate_threshold: 0.1,
                        latency_p95_threshold_ms: 1000,
                    },
                });
            }
            return Promise.resolve({ status: 'ok', database: 'ok' });
        });

        renderWithRouter(<AdminMonitoring />, { route: '/admin/monitoring', path: '/admin/monitoring' });

        expect(await screen.findByRole('heading', { name: /monitoring/i })).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('42')).toBeInTheDocument();
            expect(screen.getByText('4.8 %')).toBeInTheDocument();
            expect(screen.getByText('210 ms')).toBeInTheDocument();
            expect(screen.getByText('Opérationnel')).toBeInTheDocument();
        });
    });
});
