import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';

const NewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const productsPerPage = 12;

  useEffect(() => {
    fetchNewProducts();
  }, [currentPage]);

  const fetchNewProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getNewProducts(currentPage, productsPerPage);
      setProducts(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('신상품 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ✨ 신상품
          </h1>
          <p className="text-lg text-gray-600">
            새롭게 출시된 최신 상품들을 만나보세요
          </p>
        </div>

        {/* 상품 목록 */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 relative">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">📦</span>
                      </div>
                    )}
                    {/* 신상품 배지 */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        ✨ 신상품
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.originalPrice && product.discountRate > 0 && (
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs text-gray-400 line-through">
                              {product.originalPrice?.toLocaleString()}원
                            </span>
                            <span className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded font-medium">
                              {product.discountRate}%
                            </span>
                          </div>
                        )}
                        <span className="text-xl font-bold text-green-600">
                          {product.price?.toLocaleString()}원
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.category?.name}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        재고: {product.stockQuantity}개
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">아직 신상품이 없습니다</h3>
            <p className="text-gray-600">관리자가 신상품을 지정하면 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProducts; 