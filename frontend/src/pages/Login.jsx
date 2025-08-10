import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('로그인 시도:', formData);
      const result = await authService.login(formData.email, formData.password);
      console.log('로그인 성공:', result);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('로그인 오류:', error);
      console.error('오류 응답:', error.response);
      console.error('오류 메시지:', error.message);
      
      let errorMessage = '로그인에 실패했습니다.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.status === 401) {
        errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.';
      } else if (error.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F9FAFB', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      padding: '3rem 1rem' 
    }}>
      <div style={{ maxWidth: '28rem', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            로그인
          </h2>
          <p style={{ color: '#6B7280' }}>
            계정에 로그인하여 쇼핑을 시작하세요
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', maxWidth: '28rem', margin: '0 auto', width: '100%' }}>
        <div className="card-kurly" style={{ padding: '2rem 1rem' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem'
              }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-kurly"
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-kurly"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-kurly"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                아직 계정이 없으신가요?{' '}
                <Link
                  to="/register"
                  style={{
                    color: 'var(--kurly-green)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--kurly-green-light)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--kurly-green)'}
                >
                  회원가입
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 