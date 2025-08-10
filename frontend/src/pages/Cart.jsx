import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const response = await cartService.getCartItems();
      setCartItems(response);
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await cartService.updateCartItem(cartItemId, newQuantity);
      loadCartItems();
    } catch (error) {
      console.error('수량 변경 실패:', error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartService.removeCartItem(cartItemId);
      loadCartItems();
    } catch (error) {
      console.error('상품 제거 실패:', error);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('장바구니를 비우시겠습니까?')) return;
    
    try {
      await cartService.clearCart();
      loadCartItems();
    } catch (error) {
      console.error('장바구니 비우기 실패:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '2rem 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="card-kurly" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#6B7280' }}>장바구니를 불러오는 중...</p>
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
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>🛒 장바구니</h1>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>선택한 상품들을 확인하고 주문하세요.</p>
        </div>

        {/* 장바구니 내용 */}
        <div className="card-kurly" style={{ padding: '2rem' }}>
        {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <p style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '1.5rem' }}>장바구니가 비어있습니다.</p>
            <button
              onClick={() => navigate('/products')}
              className="btn-kurly"
              style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
            >
                쇼핑하러 가기
            </button>
          </div>
        ) : (
            <div>
              {/* 장바구니 헤더 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '2rem',
                paddingBottom: '1.5rem',
                borderBottom: '2px solid #E5E7EB'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                  장바구니 ({cartItems.length}개)
                </h2>
                <button
                  onClick={handleClearCart}
                  style={{
                    color: 'var(--kurly-red)',
                    fontSize: '0.875rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--kurly-red)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--kurly-red)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--kurly-red)';
                  }}
                >
                  장바구니 비우기
                </button>
              </div>

              {/* 상품 목록 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '1.5rem',
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}>
                    {/* 상품 이미지 */}
                    <div style={{ width: '100px', height: '100px', flexShrink: 0 }}>
                      <img
                        src={item.product.imageUrl || `https://picsum.photos/100/100?random=${item.product.id}`}
                          alt={item.product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '0.5rem'
                        }}
                      />
                    </div>
                    
                    {/* 상품 정보 */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                          {item.product.name}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.5' }}>
                          {item.product.description}
                        </p>
                      </div>
                      
                      {/* 가격 정보 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        {item.product.originalPrice && item.product.discountRate > 0 && (
                          <span style={{ fontSize: '0.875rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                            {item.product.originalPrice?.toLocaleString()}원
                          </span>
                        )}
                        <span style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--kurly-green)' }}>
                          {item.product.price?.toLocaleString()}원
                        </span>
                        {item.product.discountRate > 0 && (
                          <span style={{ 
                            fontSize: '0.75rem', 
                            backgroundColor: '#FEE2E2', 
                            color: '#DC2626', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '0.375rem',
                            fontWeight: '500'
                          }}>
                            {item.product.discountRate}%
                          </span>
                        )}
                    </div>
                    
                      {/* 수량 조절 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          background: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '1.125rem',
                          fontWeight: 'bold'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        -
                      </button>
                      <span style={{ 
                        width: '4rem', 
                        textAlign: 'center', 
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        padding: '0.5rem',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '0.375rem'
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          background: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '1.125rem',
                          fontWeight: 'bold'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        +
                      </button>
                    </div>
                    </div>
                    
                    {/* 가격 및 제거 버튼 */}
                    <div style={{ 
                      textAlign: 'right', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      minWidth: '120px'
                    }}>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--kurly-green)', marginBottom: '1rem' }}>
                        {(item.product.price * item.quantity).toLocaleString()}원
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          color: 'var(--kurly-red)',
                          fontSize: '0.875rem',
                          background: 'none',
                          border: '1px solid var(--kurly-red)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--kurly-red)';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'var(--kurly-red)';
                        }}
                      >
                        제거
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 주문 버튼 */}
              <div style={{ 
                marginTop: '2rem', 
                paddingTop: '2rem', 
                borderTop: '2px solid #E5E7EB' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem',
                  padding: '1.5rem',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '0.75rem'
                }}>
                  <span style={{ fontSize: '1.375rem', fontWeight: 'bold', color: '#111827' }}>총 합계:</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                    {getTotalPrice().toLocaleString()}원
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => navigate('/products')}
                    style={{
                      flex: 1,
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                      padding: '1rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                  >
                    쇼핑 계속하기
                  </button>
                  <button
                    onClick={() => navigate('/order')}
                    className="btn-kurly"
                    style={{ 
                      flex: 1, 
                      padding: '1rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    주문하기
                  </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default Cart; 