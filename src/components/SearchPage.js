'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import NoImage from './NoImage';
import SearchBar from './SearchBar';

const SearchPage = ({ searchType }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q');
  const mode = searchParams.get('mode');
  const type = searchParams.get('type') || searchType;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 10;

  const [fetchedResults, setFetchedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 약품 상세 페이지로 이동하는 함수
  const navigateToDrugDetail = (drugId) => {
    router.push(`/drugs/${drugId}`);
  };

  useEffect(() => {
    if (!query) {
      setFetchedResults([]);
      setTotalResults(0);
      return;
    }
    setIsLoading(true);
    setError(null);
    const apiPage = currentPage - 1;

    let url;
    let options = { method: 'GET' };
    if(mode === 'natural') { //자연어 검색
      url = '/api/api/drugs/search';
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, page: apiPage, size: itemsPerPage })
      };
    } else { // 키워드 검색 모드 분기
      if(searchType === 'symptom') { // 증상 검색
        url = `/api/api/drugs/search/symptom?q=${encodeURIComponent(query)}&page=${apiPage}&size=${itemsPerPage}`;
      } else if(searchType === 'name') { // 약품명 검색
        url = `/api/api/drugs/search/name?q=${encodeURIComponent(query)}&page=${apiPage}&size=${itemsPerPage}`;
      }
    }
    
    fetch(url, options) // 검색 타입에 따라 데이터 받아오는 방식 분기됨. !!! response 형식 정해지면 수정 필요
      .then(res => {
        if (!res.ok) throw new Error(res.message);
        return res.json();
      })
      .then(data => {
        let list = mode === 'keyword' ? data.data.searchResponseList : data.data;
        setFetchedResults(list);
        
        // totalResponseCount가 있으면 그 값을 사용하고, 없으면 현재 목록 길이를 사용
        const totalCount = data.data.totalResponseCount || list.length;
        setTotalResults(totalCount);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [query, currentPage, mode, searchType, itemsPerPage]);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full mt-[64px]">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="sticky top-[64px] bg-gray-50 z-10">
            <SearchBar
              initialQuery={query || ''}
              showTabs={true}
              initialMode={mode}
              initialType={type}
            />
          </div>
          
          {/* 검색 결과 정보 헤더 */}
          {!isLoading && !error && fetchedResults.length > 0 && (
            <div className="mt-4 mb-2">
              <h2 className="text-lg font-medium text-gray-700">
                '<span className="text-[#2BA89C] font-bold">{query}</span>' 검색 결과 
                <span className="text-[#2BA89C] font-bold ml-2">{totalResults.toLocaleString()}</span>건
              </h2>
            </div>
          )}
          
          <div className="space-y-4 mt-6">
            {isLoading ? (
              <div className="text-center py-16">로딩 중...</div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">에러: {error}</div>
            ) : fetchedResults.length > 0 ? (
              fetchedResults.map(medicine => (
                <div
                  key={medicine.drugId}
                  className="bg-white rounded-lg shadow-sm p-4 border border-transparent hover:shadow-md hover:border-[#2BA89C] transition cursor-pointer"
                  onClick={() => navigateToDrugDetail(medicine.drugId)}
                >
                  <div className="flex divide-x divide-gray-200">
                    {/* 이미지 영역 */}
                    <div className="w-48 h-48 flex-shrink-0 pr-4">
                      {medicine.imageUrl ? (
                        <img
                          src={medicine.imageUrl}
                          alt={medicine.drugName}
                          className="w-full h-full rounded-lg object-contain"
                        />
                      ) : (
                        <NoImage />
                      )}
                    </div>

                    {/* 정보 영역 */}
                    <div className="flex-1 mt-1 pl-4 space-y-3 divide-y divide-gray-300">
                      {/* 명칭 */}
                      <div className="flex items-center space-x-2 py-2">
                        <span className="flex-shrink-0 w-18 px-2 py-1 bg-[#2BA89C]/80 rounded font-bold text-white text-center whitespace-nowrap">
                          명 칭
                        </span>
                        <span className="text-base text-gray-600 break-words">
                          {medicine.drugName}
                        </span>
                      </div>
                      {/* 제약회사 */}
                      <div className="flex items-center space-x-2 py-2">
                        <span className="flex-shrink-0 w-18 px-2 py-1 bg-[#2BA89C]/80 rounded font-bold text-white text-center whitespace-nowrap">
                          제약회사
                        </span>
                        <span className="text-base text-gray-600 break-words">
                          {medicine.company}
                        </span>
                      </div>
                      {/* 효능 */}
                      <div className="flex items-center space-x-2 py-2">
                        <span className="flex-shrink-0 w-18 px-2 py-1 bg-[#2BA89C]/80 rounded font-bold text-white text-center whitespace-nowrap">
                          효 능
                        </span>
                        <span className="text-base text-gray-600 break-words">
                          {medicine.efficacy.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-2">검색 결과가 없습니다.</p>
                <p className="text-sm text-gray-400">다른 검색어로 다시 시도해 보세요.</p>
              </div>
            )}
          </div>
          
          {/* 페이지네이션 개선 */}
          {totalResults > 0 && (
            <div className="flex justify-center mt-8 mb-4 gap-2">
              {/* 이전 페이지 버튼 */}
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 rounded bg-white text-gray-600 hover:bg-gray-100"
                >
                  &lt;
                </button>
              )}
              
              {/* 페이지 번호 버튼 */}
              {Array.from({ length: Math.min(5, Math.ceil(totalResults / itemsPerPage)) }, (_, i) => {
                // 현재 페이지를 중심으로 페이지 번호 표시
                const totalPages = Math.ceil(totalResults / itemsPerPage);
                let pageNum;
                
                if (totalPages <= 5) {
                  // 전체 페이지가 5개 이하면 모든 페이지 표시
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // 현재 페이지가 1,2,3이면 1~5 표시
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // 현재 페이지가 마지막 3페이지 안에 있으면 마지막 5페이지 표시
                  pageNum = totalPages - 4 + i;
                } else {
                  // 그 외에는 현재 페이지 중심으로 앞뒤 2페이지씩 표시
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      pageNum === currentPage
                        ? 'bg-[#2BA89C] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {/* 다음 페이지 버튼 */}
              {currentPage < Math.ceil(totalResults / itemsPerPage) && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 rounded bg-white text-gray-600 hover:bg-gray-100"
                >
                  &gt;
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage; 