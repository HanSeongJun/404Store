import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import Footer from '../components/Footer';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 슬라이더 상태
  const [featuredCurrentIndex, setFeaturedCurrentIndex] = useState(0);
  const [newCurrentIndex, setNewCurrentIndex] = useState(0);
  const itemsToShow = 3; // 화면에 보여질 개수
  const itemsToSlide = 3; // 한 번에 슬라이드할 개수

  // 히어로 슬라이더 상태
  const [heroCurrentIndex, setHeroCurrentIndex] = useState(0);
  
  // 장바구니 수량 조절 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  
  // 이벤트 이미지 데이터
  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: '신선한 식재료 특가',
      subtitle: '매일 아침 배송되는 신선한 식재료',
      ctaText: '신선식품 보기',
      ctaLink: '/products?category=1'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: '신상품 출시 이벤트',
      subtitle: '새롭게 출시된 상품들을 먼저 만나보세요',
      ctaText: '신상품 보기',
      ctaLink: '/new'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: '인기 상품 할인',
      subtitle: '고객님이 선택한 인기 상품 특별 할인',
      ctaText: '인기상품 보기',
      ctaLink: '/featured'
    }
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredData, newData] = await Promise.all([
          productService.getFeaturedProductsForHome(6),
          productService.getNewProductsForHome(6)
        ]);
        setFeaturedProducts(featuredData || []);
        setNewProducts(newData || []);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 히어로 슬라이더 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCurrentIndex((prevIndex) => 
        prevIndex === heroSlides.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleAddToCart = (product) => {
    if (!authService.isAuthenticated()) {
      alert('로그인이 필요합니다.');
      return;
    }
    setSelectedProduct(product);
    setModalQuantity(1);
    setIsModalOpen(true);
  };

  const handleConfirmAddToCart = async () => {
    try {
      await cartService.addToCart(selectedProduct.id, modalQuantity);
      alert('장바구니에 추가되었습니다.');
      setIsModalOpen(false);
      setSelectedProduct(null);
      setModalQuantity(1);
    } catch (error) {
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalQuantity(1);
  };

  // 슬라이더 네비게이션 함수들
  const goToFeaturedPrevious = () => {
    setFeaturedCurrentIndex(prev => Math.max(0, prev - itemsToSlide));
  };

  const goToFeaturedNext = () => {
    setFeaturedCurrentIndex(prev => Math.min(featuredProducts.length - itemsToShow, prev + itemsToSlide));
  };

  const goToNewPrevious = () => {
    setNewCurrentIndex(prev => Math.max(0, prev - itemsToSlide));
  };

  const goToNewNext = () => {
    setNewCurrentIndex(prev => Math.min(newProducts.length - itemsToShow, prev + itemsToSlide));
  };

  const goToHeroSlide = (index) => {
    setHeroCurrentIndex(index);
  };

  const goToHeroPrevious = () => {
    setHeroCurrentIndex(prev => 
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const goToHeroNext = () => {
    setHeroCurrentIndex(prev => 
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
        <div style={{
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          height: '3rem',
          width: '3rem',
          borderBottom: '2px solid var(--kurly-green)'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '0 1rem' }}>
      {/* 히어로 슬라이더 섹션 */}
      <div style={{
        position: 'relative',
        height: '500px',
        overflow: 'hidden'
      }}>
        {/* 슬라이드 이미지들 */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === heroCurrentIndex ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{
              textAlign: 'center',
              color: 'white',
              maxWidth: '64rem',
              margin: '0 auto',
              padding: '0 2rem'
            }}>
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {slide.title}
              </h1>
              <p style={{ 
                fontSize: '1.25rem', 
                marginBottom: '2rem', 
                color: '#F3F4F6',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}>
                {slide.subtitle}
              </p>
              <Link
                to={slide.ctaLink}
                className="btn-kurly-yellow"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        ))}

        {/* 이전/다음 버튼 */}
        <button
          onClick={goToHeroPrevious}
          style={{
            position: 'absolute',
            left: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '3.5rem',
            height: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.25rem',
            color: '#374151',
            transition: 'all 0.3s ease',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          ‹
        </button>
        <button
          onClick={goToHeroNext}
          style={{
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '3.5rem',
            height: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.25rem',
            color: '#374151',
            transition: 'all 0.3s ease',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          ›
        </button>

        {/* 인디케이터 점들 */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.75rem',
          zIndex: 10,
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '2rem',
          backdropFilter: 'blur(10px)'
        }}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToHeroSlide(index)}
              style={{
                width: '0.875rem',
                height: '0.875rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === heroCurrentIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: index === heroCurrentIndex ? 'scale(1.2)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (index !== heroCurrentIndex) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                  e.target.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== heroCurrentIndex) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.transform = 'scale(1)';
                } else {
                  e.target.style.transform = 'scale(1.2)';
                }
              }}
            />
          ))}
        </div>
      </div>



              {/* 인기 상품 섹션 */}
      <section style={{ marginBottom: '4rem', maxWidth: '64rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#1F2937',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/featured')}
          onMouseEnter={(e) => e.target.style.color = '#4A7C59'}
          onMouseLeave={(e) => e.target.style.color = '#1F2937'}
          >
            인기 상품
          </h2>
        </div>
        
        <div style={{ 
          position: 'relative',
          maxWidth: '64rem',
          margin: '0 auto'
        }}>
          {/* 슬라이드 버튼 - 왼쪽 */}
          {featuredProducts.length > 3 && (
            <button
              onClick={goToFeaturedPrevious}
              disabled={featuredCurrentIndex === 0}
              style={{
                position: 'absolute',
                left: '-3rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: featuredCurrentIndex === 0 ? '#E5E7EB' : 'white',
                color: featuredCurrentIndex === 0 ? '#9CA3AF' : '#374151',
                cursor: featuredCurrentIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                if (featuredCurrentIndex !== 0) {
                  e.target.style.backgroundColor = '#F3F4F6';
                  e.target.style.transform = 'translateY(-50%) scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (featuredCurrentIndex !== 0) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }
              }}
            >
              ‹
            </button>
          )}
          
                    {/* 상품 카드 컨테이너 */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            overflow: 'hidden',
            scrollBehavior: 'smooth',
            justifyContent: 'center'
          }}>
            {featuredProducts.slice(featuredCurrentIndex, featuredCurrentIndex + 3).map((product) => (
              <div key={product.id} className="product-card-kurly" style={{ overflow: 'hidden', width: '280px', flexShrink: 0 }}>
              <Link to={`/products/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={product.imageUrl || `https://picsum.photos/300/300?random=${product.id}`}
                    alt={product.name}
                    style={{ width: '100%', height: '12rem', objectFit: 'cover' }}
                  />
                  {product.discountRate > 0 && (
                    <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
                      <span className="badge-discount">{product.discountRate}% 할인</span>
                    </div>
                  )}
                  {product.isNew && (
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                      <span className="badge-new">NEW</span>
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {product.discountRate > 0 ? (
                      <>
                        <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                          {product.price.toLocaleString()}원
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'line-through' }}>
                          {product.originalPrice?.toLocaleString()}원
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                        {product.price.toLocaleString()}원
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{product.description}</p>
                </div>
              </Link>
              
              <div style={{ padding: '0 1rem 1rem', display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/products/${product.id}`}
                  className="btn-kurly-outline"
                  style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.875rem' }}
                >
                  상세보기
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn-kurly"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                >
                  장바구니
                </button>
              </div>
            </div>
          ))}
          </div>
          
          {/* 슬라이드 버튼 - 오른쪽 */}
          {featuredProducts.length > 3 && (
            <button
              onClick={goToFeaturedNext}
              disabled={featuredCurrentIndex >= Math.max(0, featuredProducts.length - 3)}
              style={{
                position: 'absolute',
                right: '-3rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: featuredCurrentIndex >= Math.max(0, featuredProducts.length - 3) ? '#E5E7EB' : 'white',
                color: featuredCurrentIndex >= Math.max(0, featuredProducts.length - 3) ? '#9CA3AF' : '#374151',
                cursor: featuredCurrentIndex >= Math.max(0, featuredProducts.length - 3) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                if (featuredCurrentIndex < Math.max(0, featuredProducts.length - 3)) {
                  e.target.style.backgroundColor = '#F3F4F6';
                  e.target.style.transform = 'translateY(-50%) scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (featuredCurrentIndex < Math.max(0, featuredProducts.length - 3)) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }
              }}
            >
              ›
            </button>
          )}
        </div>
      </section>

      {/* 신상품 섹션 */}
      <section style={{ marginBottom: '4rem', maxWidth: '64rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#1F2937',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/new')}
          onMouseEnter={(e) => e.target.style.color = '#4A7C59'}
          onMouseLeave={(e) => e.target.style.color = '#1F2937'}
          >
            신상품
          </h2>
        </div>
        
        <div style={{ 
          position: 'relative',
          maxWidth: '64rem',
          margin: '0 auto'
        }}>
          {/* 슬라이드 버튼 - 왼쪽 */}
          {newProducts.length > 3 && (
            <button
              onClick={goToNewPrevious}
              disabled={newCurrentIndex === 0}
              style={{
                position: 'absolute',
                left: '-3rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: newCurrentIndex === 0 ? '#E5E7EB' : 'white',
                color: newCurrentIndex === 0 ? '#9CA3AF' : '#374151',
                cursor: newCurrentIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                if (newCurrentIndex !== 0) {
                  e.target.style.backgroundColor = '#F3F4F6';
                  e.target.style.transform = 'translateY(-50%) scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (newCurrentIndex !== 0) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }
              }}
            >
              ‹
            </button>
          )}
          
                    {/* 상품 카드 컨테이너 */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            overflow: 'hidden',
            scrollBehavior: 'smooth',
            justifyContent: 'center'
          }}>
            {newProducts.slice(newCurrentIndex, newCurrentIndex + 3).map((product) => (
              <div key={product.id} className="product-card-kurly" style={{ overflow: 'hidden', width: '280px', flexShrink: 0 }}>
              <Link to={`/products/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={product.imageUrl || `https://picsum.photos/300/300?random=${product.id}`}
                    alt={product.name}
                    style={{ width: '100%', height: '12rem', objectFit: 'cover' }}
                  />
                  {product.discountRate > 0 && (
                    <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
                      <span className="badge-discount">{product.discountRate}% 할인</span>
                    </div>
                  )}
                  {product.isNew && (
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                      <span className="badge-new">NEW</span>
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {product.discountRate > 0 ? (
                      <>
                        <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                          {product.price.toLocaleString()}원
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'line-through' }}>
                          {product.originalPrice?.toLocaleString()}원
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                        {product.price.toLocaleString()}원
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{product.description}</p>
                </div>
              </Link>
              
              <div style={{ padding: '0 1rem 1rem', display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/products/${product.id}`}
                  className="btn-kurly-outline"
                  style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.875rem' }}
                >
                  상세보기
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn-kurly"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                >
                  장바구니
                </button>
                             </div>
             </div>
           ))}
          </div>
          
          {/* 슬라이드 버튼 - 오른쪽 */}
          {newProducts.length > 3 && (
            <button
              onClick={goToNewNext}
              disabled={newCurrentIndex >= Math.max(0, newProducts.length - 3)}
              style={{
                position: 'absolute',
                right: '-3rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: newCurrentIndex >= Math.max(0, newProducts.length - 3) ? '#E5E7EB' : 'white',
                color: newCurrentIndex >= Math.max(0, newProducts.length - 3) ? '#9CA3AF' : '#374151',
                cursor: newCurrentIndex >= Math.max(0, newProducts.length - 3) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                if (newCurrentIndex < Math.max(0, newProducts.length - 3)) {
                  e.target.style.backgroundColor = '#F3F4F6';
                  e.target.style.transform = 'translateY(-50%) scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (newCurrentIndex < Math.max(0, newProducts.length - 3)) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }
              }}
            >
              ›
            </button>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* 장바구니 수량 조절 모달 */}
      {isModalOpen && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {selectedProduct.name}
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>수량 선택:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '1.125rem'
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '1.125rem', fontWeight: '500', minWidth: '3rem', textAlign: 'center' }}>
                  {modalQuantity}
                </span>
                <button
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '1.125rem'
                  }}
                >
                  +
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--kurly-green)' }}>
                총 가격: {(selectedProduct.price * modalQuantity).toLocaleString()}원
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleCloseModal}
                className="btn-kurly-outline"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                취소
              </button>
              <button
                onClick={handleConfirmAddToCart}
                className="btn-kurly"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                장바구니 담기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home; 