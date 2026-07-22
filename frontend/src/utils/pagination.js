const PAGE_SIZE = 20;

export function parsePaginated(data) {
    if (Array.isArray(data)) {
        return { items: data, totalPages: 1 };
    }
    const count = data.count || 0;
    return {
        items: data.results || [],
        totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE)),
    };
}
