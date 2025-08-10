import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';

function Order() {
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('virtual');
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadCartItems();
    loadUserInfo();
  }, []);

  const loadCartItems = async () => {
    try {
      const response = await cartService.getCartItems();
      setCartItems(response);
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        setUserInfo({
          name: user.name || '',
          address: user.address || '',
          phone: user.phone || ''
        });
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.product.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const handleOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert('장바구니에 상품이 없습니다. 주문할 상품을 먼저 추가해주세요.');
      return;
    }

    if (!userInfo.name || !userInfo.address || !userInfo.phone) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }

    if (paymentMethod === 'kakao' || paymentMethod === 'toss') {
      alert('아직 구현되지 않았습니다.');
      return;
    }

    setOrderLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: Number(item.product.id),
          quantity: Number(item.quantity),
          price: Number(item.product.price)
        })),
        deliveryInfo: {
          name: String(userInfo.name || '').trim(),
          address: String(userInfo.address || '').trim(),
          phone: String(userInfo.phone || '').trim()
        },
        // 백엔드가 기대하는 필드명으로 추가
        shippingAddress: String(userInfo.address || '').trim(),
        recipientName: String(userInfo.name || '').trim(),
        recipientPhone: String(userInfo.phone || '').trim(),
        paymentMethod: String(paymentMethod || ''),
        totalAmount: Number(getTotalPrice())
      };

      // 가격 데이터 검증
      console.log('가격 데이터 검증:');
      console.log('- 개별 상품 가격:', cartItems.map(item => item.product.price));
      console.log('- 수량:', cartItems.map(item => item.quantity));
      console.log('- 총 금액:', getTotalPrice());
      console.log('- totalAmount 타입:', typeof orderData.totalAmount);

      // 디버깅을 위한 로그 추가
      console.log('전송할 주문 데이터:', orderData);
      console.log('cartItems:', cartItems);
      console.log('cartItems 상세:', cartItems.map(item => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity
      })));
      console.log('userInfo:', userInfo);
      console.log('JSON.stringify(orderData):', JSON.stringify(orderData, null, 2));

      const order = await orderService.createOrder(orderData);
      
      // 가상계좌 결제인 경우 결제 완료 페이지로 이동
      if (paymentMethod === 'virtual') {
        navigate('/order/complete', { 
          state: { 
            orderId: order.id,
            totalAmount: getTotalPrice(),
            virtualAccount: '123-456789-01-234' // 가상계좌 번호
          }
        });
      }
    } catch (error) {
      console.error('주문 생성 실패:', error);
      
      // 더 자세한 오류 정보 표시
      let errorMessage = '주문 생성에 실패했습니다.';
      if (error.response?.data?.validationErrors) {
        const validationErrors = error.response.data.validationErrors;
        console.log('검증 오류 상세:', validationErrors);
        errorMessage = '입력값 검증 오류:\n' + Object.entries(validationErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      console.log('최종 오류 메시지:', errorMessage);
      alert(errorMessage);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '2rem 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
          <div className="card-kurly" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#6B7280' }}>주문 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '2rem 0' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* 헤더 */}
        <div className="card-kurly" style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>📦 주문하기</h1>
          <p style={{ color: '#6B7280' }}>주문 정보를 확인하고 결제 방법을 선택하세요.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* 왼쪽: 상품 목록 및 배송 정보 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 상품 목록 */}
            <div className="card-kurly">
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                주문 상품 ({cartItems.length}개)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB'
                  }}>
                    <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                      <img
                        src={item.product.imageUrl || `https://picsum.photos/80/80?random=${item.product.id}`}
                        alt={item.product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '0.375rem'
                        }}
                        onError={(e) => {
                          e.target.src = `https://picsum.photos/80/80?random=${item.product.id}`;
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                        {item.product.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                        {item.product.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                          수량: {item.quantity}개
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--kurly-green)' }}>
                          {(item.product.price * item.quantity).toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="card-kurly">
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                배송 정보
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    받는 사람 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                    placeholder="이름을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    배송 주소 *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                    placeholder="주소를 입력하세요"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                    placeholder="연락처를 입력하세요"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 배송 안내 */}
            <div className="card-kurly" style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🚚</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#92400E', marginBottom: '0.25rem' }}>
                    배송 안내
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#92400E' }}>
                    주문 후 1-2일 내에 배송됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 결제 정보 */}
          <div className="card-kurly" style={{ height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              결제 정보
            </h2>
            
            {/* 결제 방법 선택 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
                결제 방법
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="kakao"
                    checked={paymentMethod === 'kakao'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>카카오페이</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="toss"
                    checked={paymentMethod === 'toss'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>토스페이</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="virtual"
                    checked={paymentMethod === 'virtual'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>가상계좌</span>
                </label>
              </div>
            </div>

            {/* 주문 금액 */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>상품 금액:</span>
                <span>{getTotalPrice().toLocaleString()}원</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>배송비:</span>
                <span>0원</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '1.125rem', 
                fontWeight: 'bold',
                borderTop: '1px solid #E5E7EB',
                paddingTop: '0.5rem'
              }}>
                <span>총 결제 금액:</span>
                <span style={{ color: 'var(--kurly-green)' }}>
                  {getTotalPrice().toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 주문하기 버튼 */}
            <button
              onClick={handleOrder}
              disabled={orderLoading}
              className="btn-kurly"
              style={{ 
                width: '100%', 
                padding: '1rem',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}
            >
              {orderLoading ? '주문 처리 중...' : '주문하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
