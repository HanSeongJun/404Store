import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import { Link, useSearchParams } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams] = useSearchParams();
  
  // 장바구니 수량 조절 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  useEffect(() => {
    // URL 파라미터에서 검색어와 카테고리 가져오기
    const searchFromUrl = searchParams.get('search');
    const categoryFromUrl = searchParams.get('category');
    
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
      setActiveSearchTerm(searchFromUrl);
      setSelectedCategory('');
    } else if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setSearchTerm('');
      setActiveSearchTerm('');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, selectedCategory, activeSearchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts(
        currentPage, 
        productsPerPage, 
        selectedCategory, 
        activeSearchTerm
      );
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('상품 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setActiveSearchTerm('');
    setSearchTerm('');
    setCurrentPage(0);
  };

  const handleSearch = async (term) => {
    // 검색어가 2글자 미만이면 검색하지 않음
    if (term.length > 0 && term.length < 2) {
      return;
    }
    
    // 검색 실행
    setActiveSearchTerm(term);
    setSelectedCategory('');
    setCurrentPage(0);
    
    // URL 업데이트
    if (term.trim()) {
      window.history.pushState(null, null, `/products?search=${encodeURIComponent(term)}`);
    } else {
      window.history.pushState(null, null, '/products');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* 페이지 헤더 */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>전체 상품</h1>
          <p style={{ color: '#6B7280' }}>다양한 상품들을 둘러보세요</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="card-kurly" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 검색 */}
            <div style={{ flex: 1 }}>
              <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="상품 검색 (2글자 이상)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-kurly"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="submit"
                  disabled={searchTerm.length < 2}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: searchTerm.length < 2 ? '#9CA3AF' : '#6B7280',
                    background: 'none',
                    border: 'none',
                    cursor: searchTerm.length < 2 ? 'not-allowed' : 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (searchTerm.length >= 2) e.target.style.color = 'var(--kurly-green)';
                  }}
                  onMouseLeave={(e) => {
                    if (searchTerm.length >= 2) e.target.style.color = '#6B7280';
                  }}
                >
                  🔍
                </button>
              </form>
            </div>

            {/* 카테고리 필터 */}
            <div style={{ width: '100%' }}>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-kurly"
              >
                <option value="">전체 카테고리</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 활성 필터 표시 */}
          {(activeSearchTerm || selectedCategory) && (
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {activeSearchTerm && (
                <span className="badge-kurly" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  검색: {activeSearchTerm}
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveSearchTerm('');
                    }}
                    style={{
                      color: 'var(--kurly-green)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.125rem',
                      lineHeight: 1
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--kurly-green-dark)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--kurly-green)'}
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="badge-kurly" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  카테고리: {categories.find(c => c.id == selectedCategory)?.name}
                  <button
                    onClick={() => handleCategoryChange('')}
                    style={{
                      color: 'var(--kurly-green)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.125rem',
                      lineHeight: 1
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--kurly-green-dark)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--kurly-green)'}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* 상품 목록 */}
        {products.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {products.map((product) => (
              <div key={product.id} className="product-card-kurly" style={{ overflow: 'hidden' }}>
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
                            {product.originalPrice.toLocaleString()}원
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
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '1rem' }}>
              {activeSearchTerm || selectedCategory ? '검색 결과가 없습니다.' : '상품이 없습니다.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveSearchTerm('');
                setSelectedCategory('');
              }}
              className="btn-kurly"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              전체 상품 보기
            </button>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                borderRadius: '0.375rem',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 0 ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 0) e.target.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 0) e.target.style.backgroundColor = 'white';
              }}
            >
              이전
            </button>
            
            <span style={{ padding: '0.5rem 1rem', color: '#6B7280' }}>
              {currentPage + 1} / {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                borderRadius: '0.375rem',
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages - 1 ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages - 1) e.target.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages - 1) e.target.style.backgroundColor = 'white';
              }}
            >
              다음
            </button>
          </div>
        )}
      </div>

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

export default Products; 