import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

function OrderComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalAmount, virtualAccount } = location.state || {};

  if (!orderId || !totalAmount || !virtualAccount) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '2rem 0' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* 성공 메시지 */}
        <div className="card-kurly" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            주문이 완료되었습니다!
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
            주문번호: <strong>{orderId}</strong>
          </p>
        </div>

        {/* 입금 안내 */}
        <div className="card-kurly" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            💰 입금 안내
          </h2>
          <div style={{ 
            backgroundColor: '#FEF3C7', 
            border: '1px solid #F59E0B',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: '#92400E', fontSize: '1rem', marginBottom: '1rem' }}>
              <strong>가상계좌로 입금해주세요.</strong>
            </p>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1rem', 
              borderRadius: '0.375rem',
              border: '1px solid #F59E0B'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>입금 금액:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '500' }}>가상계좌:</span>
                <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  {virtualAccount}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#F3F4F6', padding: '1rem', borderRadius: '0.375rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              ⚠️ 주의사항
            </h3>
            <ul style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: '1.5' }}>
              <li>• 입금 확인 후 상품이 준비됩니다.</li>
              <li>• 입금자명은 주문자명과 동일하게 입력해주세요.</li>
              <li>• 입금 후 1-2일 내에 배송이 시작됩니다.</li>
              <li>• 24시간 내 미입금 시 주문이 자동 취소됩니다.</li>
            </ul>
          </div>
        </div>

        {/* 주문 상태 */}
        <div className="card-kurly" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            📦 주문 상태
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              backgroundColor: 'var(--kurly-green)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              1
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>주문 완료</h3>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>주문이 성공적으로 접수되었습니다.</p>
            </div>
          </div>
          <div style={{ 
            width: '2px', 
            height: '2rem', 
            backgroundColor: '#E5E7EB', 
            marginLeft: '1rem' 
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              backgroundColor: '#E5E7EB', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              2
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#6B7280' }}>상품 준비</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>입금 확인 후 상품을 준비합니다.</p>
            </div>
          </div>
          <div style={{ 
            width: '2px', 
            height: '2rem', 
            backgroundColor: '#E5E7EB', 
            marginLeft: '1rem' 
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              backgroundColor: '#E5E7EB', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              3
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#6B7280' }}>배송 중</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>상품이 배송됩니다.</p>
            </div>
          </div>
          <div style={{ 
            width: '2px', 
            height: '2rem', 
            backgroundColor: '#E5E7EB', 
            marginLeft: '1rem' 
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              backgroundColor: '#E5E7EB', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              4
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#6B7280' }}>배송 완료</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>상품이 도착했습니다.</p>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/orders')}
            className="btn-kurly"
            style={{ flex: 1, padding: '0.75rem 1.5rem' }}
          >
            주문 내역 보기
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              flex: 1,
              backgroundColor: '#F3F4F6',
              color: '#374151',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderComplete;
