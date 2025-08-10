import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

function Header() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
      }
    };

    loadUser();
    fetchCategories();

    // 로그인 상태 변경 감지
    const handleStorageChange = () => {
      loadUser();
    };

    const handleUserStateChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userStateChanged', handleUserStateChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStateChanged', handleUserStateChange);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsCategoryOpen(false);
  };

  const handleCategoryClick = () => {
    setIsCategoryOpen(!isCategoryOpen);
    setIsUserMenuOpen(false);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-dropdown]')) {
        setIsUserMenuOpen(false);
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {/* 상단 헤더 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '1rem 2rem', 
        borderBottom: '1px solid #F3F4F6',
        maxWidth: '64rem',
        margin: '0 auto'
      }}>
        {/* 로고 */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: 'var(--kurly-green)', 
            margin: 0,
            display: 'flex',
            alignItems: 'center'
          }}>404 STORE</h1>
        </Link>

        {/* 검색창 */}
        <form onSubmit={handleSearch} style={{ 
          flex: 1,
          maxWidth: '500px',
          margin: '0 2rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품을 검색해보세요"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '2px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                height: '44px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--kurly-green)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              검색
            </button>
          </div>
        </form>

        {/* 사용자 메뉴 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem', 
          flexShrink: 0 
        }}>
          {user ? (
            <>
              <Link to="/cart" style={{ 
                textDecoration: 'none', 
                color: '#374151', 
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                🛒 장바구니
              </Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" style={{ 
                  textDecoration: 'none', 
                  color: '#374151', 
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  ⚙️ 관리자
                </Link>
              )}
              <div style={{ position: 'relative' }} data-dropdown>
                <button
                  onClick={handleUserMenuClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem 0'
                  }}
                >
                  👤 {user.name}
                  <span>▼</span>
                </button>
                {isUserMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    minWidth: '150px',
                    marginTop: '0.5rem'
                  }}>
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid #F3F4F6' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>안녕하세요,</div>
                      <div style={{ fontWeight: '500' }}>{user.name}님</div>
                    </div>
                    <Link
                      to="/orders"
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        color: '#374151',
                        textDecoration: 'none'
                      }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      📋 주문 목록
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        color: '#374151'
                      }}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link to="/login" style={{ 
                textDecoration: 'none', 
                color: '#374151', 
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center'
              }}>
                로그인
              </Link>
              <Link to="/register" style={{ 
                textDecoration: 'none', 
                color: '#374151', 
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center'
              }}>
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 네비게이션 */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          maxWidth: '64rem', 
          margin: '0 auto', 
          padding: '0 2rem',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative' }} data-dropdown>
            <button
              onClick={handleCategoryClick}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0'
              }}
            >
              카테고리
              <span>▼</span>
            </button>
            {isCategoryOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1000,
                minWidth: '200px',
                marginTop: '0.5rem'
              }}>
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    style={{
                      display: 'block',
                      padding: '0.5rem 1rem',
                      textDecoration: 'none',
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #F3F4F6'
                    }}
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link 
            to="/products" 
            className="nav-kurly" 
            style={{ 
              color: isActivePath('/products') ? 'var(--kurly-green)' : '#374151',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 0'
            }}
          >
            전체상품
          </Link>
          
          <Link 
            to="/products?filter=featured" 
            className="nav-kurly" 
            style={{ 
              color: isActivePath('/products') && window.location.search.includes('filter=featured') ? 'var(--kurly-green)' : '#374151',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 0'
            }}
          >
            인기상품
          </Link>
          
          <Link 
            to="/products?filter=new" 
            className="nav-kurly" 
            style={{ 
              color: isActivePath('/products') && window.location.search.includes('filter=new') ? 'var(--kurly-green)' : '#374151',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 0'
            }}
          >
            신상품
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header; 