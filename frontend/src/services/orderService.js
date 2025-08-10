import api from './api';

export const orderService = {
  // 주문 생성
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('주문 생성 API 오류:', error.response?.data || error.message);
      if (error.response?.data?.validationErrors) {
        console.error('검증 오류 상세:', error.response.data.validationErrors);
      }
      throw error;
    }
  },

  // 사용자 주문 목록 조회
  getUserOrders: async () => {
    const response = await api.get('/orders/user');
    return response.data;
  },

  // 주문 상세 조회
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // 관리자용 전체 주문 목록 조회
  getAllOrders: async () => {
    const response = await api.get('/orders/admin');
    return response.data;
  },

  // 주문 상태 업데이트 (관리자용)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  }
};
