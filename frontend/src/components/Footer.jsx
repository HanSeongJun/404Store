import React from 'react';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#F9FAFB', 
      borderTop: '1px solid #E5E7EB',
      marginTop: 'auto'
    }}>
      <div style={{ 
        maxWidth: '64rem', 
        margin: '0 auto', 
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* 회사 정보 */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            🛒 쇼핑몰
          </h3>
          <p style={{ 
            color: '#6B7280', 
            fontSize: '0.875rem',
            lineHeight: '1.5',
            marginBottom: '1rem'
          }}>
            최고의 상품과 서비스로 고객님의 만족을 추구합니다.
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            fontSize: '1.5rem'
          }}>
            <span>📧</span>
            <span>📱</span>
            <span>💬</span>
          </div>
        </div>

        {/* 고객 서비스 */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            고객 서비스
          </h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ 
                color: '#6B7280', 
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}>
                자주 묻는 질문
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ 
                color: '#6B7280', 
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}>
                배송 안내
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ 
                color: '#6B7280', 
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}>
                반품/교환 안내
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ 
                color: '#6B7280', 
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}>
                고객센터
              </a>
            </li>
          </ul>
        </div>

        {/* 회사 상세 정보 */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            회사 정보
          </h3>
          <div style={{ 
            color: '#6B7280', 
            fontSize: '0.875rem',
            lineHeight: '1.6'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>상호명:</strong> 쇼핑몰
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>대표:</strong> 홍길동
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>사업자등록번호:</strong> 123-45-67890
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>주소:</strong> 서울특별시 강남구 테헤란로 123
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>전화:</strong> 02-1234-5678
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>이메일:</strong> info@shoppingmall.com
            </p>
          </div>
        </div>

      </div>

      {/* 하단 저작권 */}
      <div style={{ 
        borderTop: '1px solid #E5E7EB',
        padding: '1rem 2rem',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: '#9CA3AF', 
          fontSize: '0.75rem',
          margin: 0
        }}>
          © 2024 쇼핑몰. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer; 