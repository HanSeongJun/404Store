import api from './api';

export const authService = {
  // 로그인
  login: async (email, password) => {
    try {
      console.log('authService.login 호출:', { email, password });
      const response = await api.post('/auth/login', { email, password });
      console.log('로그인 응답:', response.data);
      
      const { token, user } = response.data;
      
      // 토큰과 사용자 정보를 로컬 스토리지에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.error('authService.login 오류:', error);
      console.error('오류 응답:', error.response);
      console.error('오류 상태:', error.response?.status);
      console.error('오류 데이터:', error.response?.data);
      
      // 더 자세한 오류 정보 제공
      if (error.response) {
        // 서버에서 응답을 받았지만 오류 상태 코드
        throw error;
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못함
        const networkError = new Error('네트워크 오류가 발생했습니다.');
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      } else {
        // 요청 설정 중 오류 발생
        throw error;
      }
    }
  },

  // 회원가입
  register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 토큰 확인
  getToken: () => {
    return localStorage.getItem('token');
  },

  // 로그인 상태 확인
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
}; 