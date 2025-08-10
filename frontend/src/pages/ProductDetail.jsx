import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productData = await productService.getProduct(id);
      setProduct(productData);
    } catch (error) {
      console.error('상품 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await cartService.addToCart(product.id, quantity);
      alert(`${product.name}이(가) 장바구니에 ${quantity}개 추가되었습니다!`);
    } catch (error) {
      alert('장바구니 추가에 실패했습니다: ' + (error.response?.data?.message || '알 수 없는 오류'));
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '4rem',
            width: '4rem',
            borderBottom: '2px solid var(--kurly-green)',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6B7280' }}>상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>😕</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '1rem' }}>상품을 찾을 수 없습니다</h1>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
          <Link 
            to="/products"
            className="btn-kurly"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            상품 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '2rem 0' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* 브레드크럼 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#6B7280', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--kurly-green)'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>홈</Link>
          <span>›</span>
          <Link to="/products" style={{ color: '#6B7280', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--kurly-green)'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>상품</Link>
          <span>›</span>
          <Link to={`/products?category=${product.category?.id}`} style={{ color: '#6B7280', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--kurly-green)'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>
            {product.category?.name}
          </Link>
          <span>›</span>
          <span style={{ color: '#374151', fontWeight: '500' }}>{product.name}</span>
        </nav>

        <div className="card-kurly" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem' }}>
            {/* 상품 이미지 */}
            <div>
              <img
                src={product.imageUrl || 'https://via.placeholder.com/500x500?text=상품이미지'}
                alt={product.name}
                style={{ width: '100%', height: 'auto', borderRadius: '0.5rem' }}
              />
            </div>

            {/* 상품 정보 */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '0.25rem 0.75rem', 
                  backgroundColor: 'var(--kurly-green)', 
                  color: 'white', 
                  borderRadius: '9999px', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '1rem'
                }}>
                  {product.category?.name}
                </span>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>{product.name}</h1>
                
                {/* 가격 정보 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {product.discountRate > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                        {product.price.toLocaleString()}원
                      </span>
                      <span style={{ fontSize: '1.25rem', color: '#6B7280', textDecoration: 'line-through' }}>
                        {product.originalPrice.toLocaleString()}원
                      </span>
                      <span className="badge-discount">{product.discountRate}% 할인</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                      {product.price.toLocaleString()}원
                    </span>
                  )}
                </div>

                {/* 상품 설명 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>상품 설명</h3>
                  <p style={{ color: '#6B7280', lineHeight: '1.6' }}>{product.description}</p>
                </div>

                {/* 재고 및 리뷰 정보 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#6B7280' }}>재고 {product.stockQuantity}개</span>
                    <span style={{ color: '#F59E0B' }}>⭐</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#6B7280' }}>4.8 (리뷰 127개)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#6B7280' }}>무료배송</span>
                    <span>🚚</span>
                  </div>
                </div>

                {/* 수량 선택 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>수량:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        border: '1px solid #E5E7EB',
                        backgroundColor: 'white',
                        borderRadius: '0.25rem',
                        cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                        opacity: quantity <= 1 ? 0.5 : 1,
                        fontSize: '1.125rem'
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '1.125rem', fontWeight: '500', minWidth: '3rem', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockQuantity}
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        border: '1px solid #E5E7EB',
                        backgroundColor: 'white',
                        borderRadius: '0.25rem',
                        cursor: quantity >= product.stockQuantity ? 'not-allowed' : 'pointer',
                        opacity: quantity >= product.stockQuantity ? 0.5 : 1,
                        fontSize: '1.125rem'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 총 가격 */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>총 가격:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                      {(product.price * quantity).toLocaleString()}원
                    </span>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="btn-kurly"
                    style={{ flex: 1, padding: '1rem', fontSize: '1.125rem', fontWeight: '600' }}
                  >
                    {addingToCart ? '추가 중...' : '장바구니 담기'}
                  </button>
                  <button
                    style={{
                      padding: '1rem',
                      border: '1px solid #E5E7EB',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '1.125rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    ❤️ 찜하기
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 상품 상세 정보 탭 */}
          <div style={{ borderTop: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex' }}>
              <button style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderBottom: '2px solid var(--kurly-green)',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                상품 정보
              </button>
              <button style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                리뷰 (127)
              </button>
              <button style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                배송/교환/반품
              </button>
            </div>

            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>상품 상세 정보</h3>
              <p style={{ marginBottom: '1.5rem' }}>{product.description}</p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>제품 사양</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontWeight: '500', display: 'inline-block', width: '120px' }}>브랜드:</span>
                    <span>StyleShop</span>
                  </li>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontWeight: '500', display: 'inline-block', width: '120px' }}>카테고리:</span>
                    <span>{product.category?.name}</span>
                  </li>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontWeight: '500', display: 'inline-block', width: '120px' }}>모델명:</span>
                    <span>{product.name}</span>
                  </li>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontWeight: '500', display: 'inline-block', width: '120px' }}>제조국:</span>
                    <span>대한민국</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>배송 정보</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontWeight: '500', display: 'inline-block', width: '120px' }}>배송비:</span>
                    <span>무료배송</span>
                  </li>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontWeight: '500', display: 'inline-block', width: '120px' }}>배송기간:</span>
                    <span>1-2일 (영업일 기준)</span>
                  </li>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontWeight: '500', display: 'inline-block', width: '120px' }}>배송지역:</span>
                    <span>전국 (일부 도서산간 제외)</span>
                  </li>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontWeight: '500', display: 'inline-block', width: '120px' }}>포장방법:</span>
                    <span>안전포장</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 