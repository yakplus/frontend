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
  const mode = searchParams.get('mode') || 'keyword';

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

    if (searchType === 'keyword') {
      url = '/api/api/drugs/search';
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, page: apiPage, size: itemsPerPage })
      };
    } else if (searchType === 'symptom') {
      url = `/api/api/drugs/search/symptom?q=${encodeURIComponent(query)}&page=${apiPage}&size=${itemsPerPage}`;
    }

    fetch(url, options)
      .then(res => {
        if (!res.ok) throw new Error('서버 에러');
        return res.json();
      })
      .then(data => {
        let list = searchType === 'keyword' ? data.data : data.data.searchResponseList;
        setFetchedResults(list);
        setTotalResults(list.length);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [query, currentPage, searchType]);

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
            />
          </div>
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
          {fetchedResults.length > 0 && (
            <div className="flex justify-center mt-8 mb-4 gap-2">
              {[...Array(Math.ceil(totalResults / itemsPerPage)).keys()].map(i => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    i + 1 === currentPage
                      ? 'bg-[#2BA89C] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage; 