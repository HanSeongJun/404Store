import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    role: 'USER' // 기본값은 USER
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || '회원가입에 실패했습니다.');
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
            회원가입
          </h2>
          <p style={{ color: '#6B7280' }}>
            새로운 계정을 만들어 쇼핑을 시작하세요
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
                이메일 *
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
              <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                이름 *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-kurly"
                placeholder="이름을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                비밀번호 *
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
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                비밀번호 확인 *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-kurly"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="phone" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                전화번호 (선택)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="input-kurly"
                placeholder="전화번호를 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="address" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                주소 (선택)
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-kurly"
                placeholder="주소를 입력하세요"
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* 개발용 관리자 계정 생성 옵션 */}
            <div>
              <label htmlFor="role" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                계정 유형 (개발용)
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-kurly"
                style={{ 
                  backgroundColor: 'white',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  width: '100%'
                }}
              >
                <option value="USER">일반 사용자</option>
                <option value="ADMIN">관리자</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                ⚠️ 개발용 기능입니다. 실제 서비스에서는 제거하세요.
              </p>
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
                {loading ? '가입 중...' : '회원가입'}
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                이미 계정이 있으신가요?{' '}
                <Link
                  to="/login"
                  style={{
                    color: 'var(--kurly-green)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--kurly-green-light)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--kurly-green)'}
                >
                  로그인
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register; 