'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import NoImage from '../../../components/NoImage';
import SearchBar from '../../../components/SearchBar';

// SearchParams를 사용하는 컴포넌트를 분리
const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0); // 전체 검색 결과 수
  const itemsPerPage = 10; // 페이지당 항목 수

  // 서버에서 받아올 실제 검색 결과
  const [fetchedResults, setFetchedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // query 또는 currentPage가 바뀔 때마다 서버 요청
  useEffect(() => {
    if (!query) {
      setFetchedResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    const apiPage = currentPage - 1; // API에 0부터 시작하는 페이지 인덱스 전달
    const url = `/api/api/drugs/search`;
    const body = {
      query,
      page: apiPage,
      size: itemsPerPage,
    };
    fetch(
      url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      .then(res => {
        if (!res.ok) throw new Error('서버 에러');
        return res.json();
      })
      .then(data => {
        const list = data.data.searchResponseList;
        setFetchedResults(list);
        setTotalResults(list.length);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [query, currentPage]);
  
  // const [selectedType, setSelectedType] = useState('all');
  // const [sortBy, setSortBy] = useState('name');
  // const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  // const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  

  // // 임시 검색 결과 데이터
  // const mockResults = [
  //   {
  //     id: 1,
  //     name: "타이레놀",
  //     category: "일반 의약품",
  //     company: "(주)한국얀센 / Janssen Korea",
  //     effect: "아세트아미노펜 과립",
  //     symptoms: ["감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통(삔 통증)"],
  //     image: null
  //   },
  //   {
  //     id: 2,
  //     name: "부루펜",
  //     category: "일반 의약품",
  //     company: "삼일제약(주) / Samil",
  //     effect: "이부프로펜",
  //     symptoms: ["류마티양 관절염, 연소성 류마티양 관절염, 골관절염(퇴행성 관절질환), 감기로 인한 발열 및 동통, 요통, 월경곤란증, 수술후 동통"],
  //     image: null
  //   },
  //   {
  //     id: 3,
  //     name: "트라펜정",
  //     category: "전문 의약품",
  //     company: "명문제약(주) / Myungmoon Pharm",
  //     effect: "트라마돌염산염,아세트아미노펜",
  //     symptoms: ["중등도-중증의 급ㆍ만성 통증"],
  //     image: null
  //   },
  // ];

  // // 검색어에 따른 결과 필터링 (임시로 "두통" 검색어만 결과 표시)
  // const searchResults = query?.toLowerCase() === "두통" ? mockResults : [];

  // // 선택된 타입에 따라 결과 필터링
  // const filteredResults = selectedType === 'all' 
  //   ? fetchedResults
  //   : fetchedResults.filter(medicine => {
  //       if (selectedType === 'general') return medicine.category === "일반 의약품";
  //       if (selectedType === 'prescription') return medicine.category === "전문 의약품";
  //       return true;
  //     });

  // // 정렬 기준에 따라 결과 정렬
  // const sortedResults = [...filteredResults].sort((a, b) => {
  //   switch (sortBy) {
  //     case 'name':
  //       return a.name.localeCompare(b.name, 'ko');
  //     case 'effect':
  //       return a.effect.localeCompare(b.effect, 'ko');
  //     case 'company':
  //       return a.company.localeCompare(b.company, 'ko');
  //     default:
  //       return 0;
  //   }
  // });

  // 검색 결과 수 업데이트
  // useEffect(() => {
  //   setTotalResults(sortedResults.length);
  // }, [sortedResults.length]);

  // // 드롭다운 외부 클릭 시 닫기
  // const handleClickOutside = () => {
  //   setShowTypeDropdown(false);
  //   setShowSortDropdown(false);
  // };

  // const getTypeLabel = () => {
  //   switch (selectedType) {
  //     case 'all': return '전체';
  //     case 'general': return '일반 의약품';
  //     case 'prescription': return '전문 의약품';
  //     default: return '전체';
  //   }
  // };

  // const getSortLabel = () => {
  //   switch (sortBy) {
  //     case 'name': return '제품명';
  //     case 'effect': return '성분명';
  //     case 'company': return '제약회사';
  //     default: return '제품명';
  //   }
  // };

  // // 현재 필터 상태 텍스트 생성
  // const getFilterStatusText = () => {
  //   const typeText = selectedType === 'all' ? '' : `${getTypeLabel()} · `;
  //   const sortText = `${getSortLabel()} 순`;
  //   return `${typeText}${sortText}`;
  // };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full mt-[64px]">
        <div className="max-w-7xl mx-auto w-full px-4">
          {/* 검색창 영역 */}
          <div className="sticky top-[64px] bg-gray-50 z-10">
            <SearchBar 
              initialQuery={query || ''} 
              showTabs={true}
              initialMode="keyword"
            />
          </div>

          {/* 검색 결과 목록 */}
          <div className="space-y-4 mt-6">
            {isLoading ? (
              <div className="text-center py-16">로딩 중...</div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">에러: {error}</div>
            ) : fetchedResults.length > 0 ? (
              fetchedResults.map((medicine) => (
                <div
                  key={medicine.drugId}
                  className="bg-white rounded-lg shadow-sm p-4 border border-transparent hover:shadow-md hover:border-[#2BA89C] transition"
                  // className="bg-white rounded-lg shadow-sm p-2 hover:shadow-md transition-shadow"
                >
                  <div className="flex divide-x divide-gray-200">
                  {/* <div className="flex items-start gap-4"> */}
                  {/* <div className="flex gap-4"> */}
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

                    {/* 정보영역 */}
                    <div className="flex-1 mt-11 pl-4 space-y-2 leading-relaxed">
                    {/* <div className="flex-1 mt-20 space-y-3 leading-relaxed"> */}
                      <p className="text-base text-gray-600">명칭: {medicine.drugName}</p>
                      <p className="text-base text-gray-600">제약회사: {medicine.company}</p>
                      <p className="text-base text-gray-600">
                        효능: {medicine.efficacy.join(', ')}
                      </p>
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
          
          
          

          {/* 페이지네이션 */}
          {fetchedResults.length > 0 && (
            <div className="flex justify-center mt-8 gap-2">
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

// 메인 페이지 컴포넌트
const SymptomSearchResults = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
};

export default SymptomSearchResults; 