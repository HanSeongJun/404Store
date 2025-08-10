import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

function AdminManagement() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // 카테고리 관리 상태
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  // 상품 폼 상태
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
    isFeatured: false,
    isNew: false,
    discountRate: 0
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    console.log('Current user:', user); // 디버깅용
    
    if (!user) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }
    
    if (user.role !== 'ADMIN') {
      alert('관리자 권한이 필요합니다.');
      window.location.href = '/';
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      console.log('Token:', token); // 디버깅용
      
      switch (activeTab) {
        case 'products':
          const productsResponse = await fetch('http://localhost:8080/api/products', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Products response status:', productsResponse.status); // 디버깅용
          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            console.log('Products data:', productsData); // 디버깅용
            setProducts(productsData.content || productsData); // 페이지네이션 응답 처리
          } else {
            console.error('Products API error:', productsResponse.status, productsResponse.statusText);
          }
          break;
        case 'categories':
          const categoriesResponse = await fetch('http://localhost:8080/api/categories', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Categories response status:', categoriesResponse.status); // 디버깅용
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            console.log('Categories data:', categoriesData); // 디버깅용
            setCategories(categoriesData);
          } else {
            console.error('Categories API error:', categoriesResponse.status, categoriesResponse.statusText);
          }
          break;
        case 'orders':
          const ordersResponse = await fetch('http://localhost:8080/api/orders/admin/all', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Orders response status:', ordersResponse.status); // 디버깅용
          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            console.log('Orders data:', ordersData); // 디버깅용
            setOrders(ordersData.content || []);
          } else {
            console.error('Orders API error:', ordersResponse.status, ordersResponse.statusText);
          }
          break;
      }

      // 상품 관리 탭이 아닐 때만 카테고리 데이터 가져오기 (카테고리 관리 탭에서는 별도로 처리)
      if (activeTab === 'products') {
        const categoriesResponse = await fetch('http://localhost:8080/api/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          console.log('Categories data:', categoriesData); // 디버깅용
          setCategories(categoriesData);
        } else {
          console.error('Categories API error:', categoriesResponse.status, categoriesResponse.statusText);
        }
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      alert('데이터를 불러오는데 실패했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`정말로 이 ${type}을 삭제하시겠습니까?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      });

      if (response.ok) {
        alert(`${type}이 삭제되었습니다.`);
        fetchData();
      } else {
        alert(`${type} 삭제에 실패했습니다.`);
      }
    } catch (error) {
      console.error(`${type} 삭제 실패:`, error);
      alert(`${type} 삭제에 실패했습니다.`);
    }
  };

  // 카테고리 관리 함수들
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description
      };

      const url = isCategoryEditing 
        ? `http://localhost:8080/api/categories/${editingCategoryId}`
        : 'http://localhost:8080/api/categories';
      
      const method = isCategoryEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify(categoryData)
      });

      if (response.ok) {
        alert(isCategoryEditing ? '카테고리가 수정되었습니다.' : '카테고리가 추가되었습니다.');
        resetCategoryForm();
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`카테고리 ${isCategoryEditing ? '수정' : '추가'}에 실패했습니다: ${errorData.message}`);
      }
    } catch (error) {
      console.error('카테고리 처리 실패:', error);
      alert(`카테고리 ${isCategoryEditing ? '수정' : '추가'}에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryEdit = (category) => {
    setIsCategoryEditing(true);
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      description: category.description || ''
    });
  };

  const handleCategoryCancelEdit = () => {
    setIsCategoryEditing(false);
    setEditingCategoryId(null);
    resetCategoryForm();
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: ''
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading && !products.length && !categories.length) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '1.125rem',
        color: '#6B7280'
      }}>
        데이터를 불러오는 중입니다... 브라우저 콘솔을 확인해주세요.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        관리자 페이지
      </h1>
      
      {/* 디버깅 정보 */}
      <div style={{ 
        backgroundColor: '#F3F4F6', 
        padding: '1rem', 
        borderRadius: '0.5rem', 
        marginBottom: '2rem',
        fontSize: '0.875rem'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>디버깅 정보:</div>
        <div>현재 사용자: {authService.getCurrentUser()?.name || '없음'} ({authService.getCurrentUser()?.role || '없음'})</div>
        <div>토큰: {authService.getToken() ? '있음' : '없음'}</div>
        <div>현재 탭: {activeTab}</div>
        <div>로딩 상태: {loading ? '로딩 중' : '완료'}</div>
        <div>상품 수: {products.length}개</div>
        <div>카테고리 수: {categories.length}개</div>
        <div>주문 수: {orders.length}개</div>
      </div>

      {/* 탭 버튼 */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem'
      }}>
        {['products', 'categories', 'orders'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === tab ? 'var(--kurly-green)' : '#F3F4F6',
              color: activeTab === tab ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {tab === 'products' && '상품 관리'}
            {tab === 'categories' && '카테고리 관리'}
            {tab === 'orders' && '주문 관리'}
          </button>
        ))}
      </div>

      {/* 상품 관리 */}
      {activeTab === 'products' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            {isEditing ? '상품 수정' : '상품 추가'}
          </h2>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            
            try {
              let imageUrl = productForm.imageUrl;
              
              // 파일이 선택된 경우 업로드
              if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                
                const uploadResponse = await fetch('http://localhost:8080/api/upload', {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${authService.getToken()}` },
                  body: formData
                });
                
                if (uploadResponse.ok) {
                  const uploadData = await uploadResponse.json();
                  imageUrl = uploadData.imageUrl;
                } else {
                  throw new Error('파일 업로드에 실패했습니다.');
                }
              }
              
              const productData = {
                ...productForm,
                imageUrl,
                price: parseFloat(productForm.price),
                originalPrice: parseFloat(productForm.originalPrice),
                stockQuantity: parseInt(productForm.stockQuantity),
                categoryId: parseInt(productForm.categoryId),
                discountRate: parseFloat(productForm.discountRate)
              };
              
              const url = isEditing 
                ? `http://localhost:8080/api/products/${editingId}`
                : 'http://localhost:8080/api/products';
              
              const method = isEditing ? 'PUT' : 'POST';
              
              const response = await fetch(url, {
                method,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify(productData)
              });
              
              if (response.ok) {
                alert(isEditing ? '상품이 수정되었습니다.' : '상품이 추가되었습니다.');
                resetForm();
                fetchData();
              } else {
                const errorData = await response.json();
                alert(`상품 ${isEditing ? '수정' : '추가'}에 실패했습니다: ${errorData.message}`);
              }
            } catch (error) {
              console.error('상품 처리 실패:', error);
              alert(`상품 ${isEditing ? '수정' : '추가'}에 실패했습니다: ${error.message}`);
            } finally {
              setLoading(false);
            }
          }} style={{ 
            backgroundColor: '#F9FAFB', 
            padding: '2rem', 
            borderRadius: '0.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  상품명 *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  카테고리 *
                </label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">카테고리 선택</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  가격 *
                </label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                  min="0"
                  step="100"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  원가
                </label>
                <input
                  type="number"
                  value={productForm.originalPrice}
                  onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                  min="0"
                  step="100"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  재고 수량 *
                </label>
                <input
                  type="number"
                  value={productForm.stockQuantity}
                  onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                  required
                  min="0"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  할인율 (%)
                </label>
                <input
                  type="number"
                  value={productForm.discountRate}
                  onChange={(e) => setProductForm({ ...productForm, discountRate: e.target.value })}
                  min="0"
                  max="100"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                상품 설명
              </label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                이미지 업로드
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert('파일 크기는 5MB 이하여야 합니다.');
                      return;
                    }
                    setSelectedFile(file);
                    setProductForm({ ...productForm, imageUrl: '' });
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              {selectedFile && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6B7280' }}>
                  선택된 파일: {selectedFile.name}
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                이미지 URL (파일 업로드 대신 사용)
              </label>
              <input
                type="url"
                value={productForm.imageUrl}
                onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                disabled={selectedFile !== null}
                placeholder={selectedFile ? '파일이 선택되어 URL 입력이 비활성화됩니다' : '이미지 URL을 입력하세요'}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: selectedFile ? '#F3F4F6' : 'white'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                />
                인기 상품
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={productForm.isNew}
                  onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                />
                신상품
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--kurly-green)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? '처리 중...' : (isEditing ? '📝 상품 수정' : '📦 상품 추가')}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6B7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  취소
                </button>
              )}
            </div>
          </form>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            상품 목록
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>이미지</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>상품명</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>카테고리</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>가격</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>재고</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>상태</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>작업</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <img 
                        src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`) : 'https://picsum.photos/50/50'} 
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }}
                        onError={(e) => {
                          e.target.src = 'https://picsum.photos/50/50';
                        }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{product.name}</td>
                    <td style={{ padding: '0.75rem' }}>{product.categoryName}</td>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>
                      {formatPrice(product.price)}원
                    </td>
                    <td style={{ padding: '0.75rem' }}>{product.stockQuantity}개</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {product.isFeatured && (
                          <span style={{ 
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}>
                            인기
                          </span>
                        )}
                        {product.isNew && (
                          <span style={{ 
                            backgroundColor: '#DBEAFE',
                            color: '#1E40AF',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}>
                            신상
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditingId(product.id);
                            setProductForm({
                              name: product.name,
                              description: product.description || '',
                              price: product.price.toString(),
                              originalPrice: product.originalPrice?.toString() || '',
                              stockQuantity: product.stockQuantity.toString(),
                              categoryId: product.categoryId?.toString() || '',
                              imageUrl: product.imageUrl || '',
                              isFeatured: product.isFeatured || false,
                              isNew: product.isNew || false,
                              discountRate: product.discountRate || 0
                            });
                            setSelectedFile(null);
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, 'products')}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#DC2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 카테고리 관리 */}
      {activeTab === 'categories' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            {isCategoryEditing ? '카테고리 수정' : '카테고리 추가'}
          </h2>
          
          <form onSubmit={handleCategorySubmit} style={{ 
            backgroundColor: '#F9FAFB', 
            padding: '2rem', 
            borderRadius: '0.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  카테고리명 *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  설명
                </label>
                <input
                  type="text"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--kurly-green)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? '처리 중...' : (isCategoryEditing ? '📝 카테고리 수정' : '📂 카테고리 추가')}
              </button>
              
              {isCategoryEditing && (
                <button
                  type="button"
                  onClick={handleCategoryCancelEdit}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6B7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  취소
                </button>
              )}
            </div>
          </form>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            카테고리 목록
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>카테고리명</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>설명</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>작업</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{category.id}</td>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{category.name}</td>
                    <td style={{ padding: '0.75rem' }}>{category.description || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleCategoryEdit(category)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, 'categories')}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#DC2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 주문 관리 */}
      {activeTab === 'orders' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            주문 관리
          </h2>
          
          {orders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              backgroundColor: '#F9FAFB',
              borderRadius: '0.5rem',
              color: '#6B7280'
            }}>
              아직 주문이 없습니다.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>주문번호</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>주문자</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>상품 정보</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>배송 정보</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>결제 방법</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>총 금액</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>주문 상태</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(orders) && orders.length > 0 ? orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '500' }}>{order.id}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>{order.userName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{order.userEmail}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {order.orderItems && Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                            order.orderItems.map((item, index) => (
                              <div key={index} style={{ fontSize: '0.875rem' }}>
                                {item.productName} x {item.quantity}개
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                              상품 정보 없음
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                          <div>{order.recipientName || '이름 없음'}</div>
                          <div style={{ color: '#6B7280' }}>{order.shippingAddress || '주소 없음'}</div>
                          <div style={{ color: '#6B7280' }}>{order.recipientPhone || '전화번호 없음'}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {order.paymentMethod === 'virtual' ? '가상계좌' : order.paymentMethod}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: '500', color: 'var(--kurly-green)' }}>
                        {order.totalAmount ? order.totalAmount.toLocaleString() : 0}원
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <select
                          value={order.status}
                          onChange={async (e) => {
                            try {
                              const response = await fetch(`http://localhost:8080/api/orders/admin/${order.id}/status`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${authService.getToken()}`
                                },
                                body: JSON.stringify({ status: e.target.value })
                              });
                              
                              if (response.ok) {
                                alert('주문 상태가 업데이트되었습니다.');
                                fetchData();
                              } else {
                                alert('주문 상태 업데이트에 실패했습니다.');
                              }
                            } catch (error) {
                              console.error('주문 상태 업데이트 실패:', error);
                              alert('주문 상태 업데이트에 실패했습니다.');
                            }
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #D1D5DB',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="PENDING">상품 준비</option>
                          <option value="CONFIRMED">주문 확인</option>
                          <option value="PROCESSING">처리 중</option>
                          <option value="SHIPPED">배송 중</option>
                          <option value="DELIVERED">배송 완료</option>
                          <option value="CANCELLED">주문 취소</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ko-KR') : '날짜 없음'}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
                        주문 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function resetForm() {
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      stockQuantity: '',
      categoryId: '',
      imageUrl: '',
      isFeatured: false,
      isNew: false,
      discountRate: 0
    });
    setSelectedFile(null);
  }
}

export default AdminManagement; 