import api from './api';

export const productService = {
  // 상품 관련
  getProducts: async (page = 0, size = 10, categoryId = null, search = '') => {
    let url = `/products?page=${page}&size=${size}`;
    
    if (categoryId) {
      url = `/products/category/${categoryId}?page=${page}&size=${size}`;
    }
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // 상품 삭제 추가
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // 상품 수정 추가
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // 인기상품 조회 (관리자가 지정한)
  getFeaturedProducts: async (page = 0, size = 12) => {
    const response = await api.get(`/products/featured?page=${page}&size=${size}`);
    return response.data;
  },

  // 신상품 조회 (관리자가 지정한)
  getNewProducts: async (page = 0, size = 12) => {
    const response = await api.get(`/products/new?page=${page}&size=${size}`);
    return response.data;
  },

  // 홈페이지용 인기상품
  getFeaturedProductsForHome: async (limit = 6) => {
    const response = await api.get(`/products/featured/home?limit=${limit}`);
    return response.data;
  },

  // 홈페이지용 신상품
  getNewProductsForHome: async (limit = 6) => {
    const response = await api.get(`/products/new/home?limit=${limit}`);
    return response.data;
  },

  // 카테고리 관련
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // 카테고리 삭제 추가
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
}; 