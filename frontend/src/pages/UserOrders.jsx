import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      console.log('주문 내역 응답:', response);
      setOrders(response);
    } catch (error) {
      console.error('주문 내역 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return '상품 준비';
      case 'SHIPPING':
        return '배송 중';
      case 'DELIVERED':
        return '배송 완료';
      case 'CANCELLED':
        return '주문 취소';
      default:
        return '주문 접수';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#F59E0B';
      case 'SHIPPING':
        return '#3B82F6';
      case 'DELIVERED':
        return '#10B981';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '2rem 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="card-kurly" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#6B7280' }}>주문 내역을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '2rem 0' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* 헤더 */}
        <div className="card-kurly" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>📋 주문 내역</h1>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>내가 주문한 상품들의 상태를 확인하세요.</p>
        </div>

        {orders.length === 0 ? (
          <div className="card-kurly" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '1.5rem' }}>아직 주문한 상품이 없습니다.</p>
            <button
              onClick={() => navigate('/products')}
              className="btn-kurly"
              style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((order) => (
              <div key={order.id} className="card-kurly" style={{ padding: '2rem' }}>
                {/* 주문 헤더 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '2px solid #E5E7EB'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                      주문번호: {order.id}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      주문일: {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div style={{ 
                    padding: '0.75rem 1.25rem',
                    backgroundColor: getStatusColor(order.status) + '20',
                    color: getStatusColor(order.status),
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    border: `1px solid ${getStatusColor(order.status)}40`
                  }}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                {/* 주문 상품 목록 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid #E5E7EB'
                  }}>
                    주문 상품
                  </h4>
                  {order.orderItems && order.orderItems.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem',
                      marginBottom: '0.75rem',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ width: '70px', height: '70px', flexShrink: 0 }}>
                        <img
                          src={item.product?.imageUrl || `https://picsum.photos/70/70?random=${item.product?.id || index}`}
                          alt={item.product?.name || item.productName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '0.375rem'
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
                          {item.product?.name || item.productName}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                          수량: {item.quantity}개
                        </p>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--kurly-green)' }}>
                          {item.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 주문 정보 */}
                <div style={{ 
                  backgroundColor: '#F3F4F6', 
                  padding: '1.5rem', 
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem',
                  border: '1px solid #E5E7EB'
                }}>
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid #D1D5DB'
                  }}>
                    배송 정보
                  </h4>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6B7280', 
                    lineHeight: '1.6',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '500', color: '#374151', minWidth: '80px' }}>받는 사람:</span>
                      <span>{order.recipientName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '500', color: '#374151', minWidth: '80px' }}>주소:</span>
                      <span>{order.shippingAddress}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '500', color: '#374151', minWidth: '80px' }}>연락처:</span>
                      <span>{order.recipientPhone}</span>
                    </div>
                  </div>
                </div>

                {/* 결제 정보 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '1.5rem',
                  borderTop: '2px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  marginTop: '1rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      결제 방법: {order.paymentMethod === 'virtual' ? '가상계좌' : order.paymentMethod}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>총 결제 금액:</span>
                    <span style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      color: 'var(--kurly-green)',
                      marginLeft: '0.75rem'
                    }}>
                      {order.totalAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserOrders;
