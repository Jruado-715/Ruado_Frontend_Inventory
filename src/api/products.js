// ─── api/products.js ─────────────────────────────────────────────────────────
import api from './client';

export const productsApi = {
  /**
   * Fetch all products with optional filters.
   * @param {Object} params - { search, category, sort_by, sort_dir }
   */
  getAll: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.search)   qs.set('search',   params.search);
    if (params.category && params.category !== 'All') qs.set('category', params.category);
    if (params.sort_by)  qs.set('sort_by',  params.sort_by);
    if (params.sort_dir) qs.set('sort_dir', params.sort_dir);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return api.get(`/products${query}`);
  },

  create: (product) => api.post('/products', product),

  update: (id, product) => api.put(`/products/${id}`, product),

  delete: (id) => api.delete(`/products/${id}`),
};
