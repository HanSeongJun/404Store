import api from './api';

export const cartService = {
  // 장바구니 항목 조회
  getCartItems: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 장바구니에 상품 추가
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart', { productId, quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 장바구니 항목 수량 업데이트
  updateCartItem: async (cartItemId, quantity) => {
    try {
      const response = await api.put(`/cart/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 장바구니 항목 삭제
  removeFromCart: async (cartItemId) => {
    try {
      const response = await api.delete(`/cart/${cartItemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 장바구니 전체 삭제
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 