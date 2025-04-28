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
  const mode = searchParams.get('mode');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0); // 전체 검색 결과 수
  const itemsPerPage = 10; // 페이지당 항목 수

  // 임시 검색 결과 데이터
  const mockResults = [
    {
      id: 1,
      name: "타이레놀",
      category: "일반 의약품",
      company: "(주)한국얀센 / Janssen Korea",
      effect: "아세트아미노펜 과립",
      symptoms: ["감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통(삔 통증)"],
      image: null
    },
    {
      id: 2,
      name: "부루펜",
      category: "일반 의약품",
      company: "삼일제약(주) / Samil",
      effect: "이부프로펜",
      symptoms: ["류마티양 관절염, 연소성 류마티양 관절염, 골관절염(퇴행성 관절질환), 감기로 인한 발열 및 동통, 요통, 월경곤란증, 수술후 동통"],
      image: null
    },
    {
      id: 3,
      name: "트라펜정",
      category: "전문 의약품",
      company: "명문제약(주) / Myungmoon Pharm",
      effect: "트라마돌염산염,아세트아미노펜",
      symptoms: ["중등도-중증의 급ㆍ만성 통증"],
      image: null
    },
  ];

  // 검색어에 따른 결과 필터링 (임시로 "두통" 검색어만 결과 표시)
  const searchResults = query?.toLowerCase() === "두통" ? mockResults : [];

  // 선택된 타입에 따라 결과 필터링
  const filteredResults = selectedType === 'all' 
    ? searchResults
    : searchResults.filter(medicine => {
        if (selectedType === 'general') return medicine.category === "일반 의약품";
        if (selectedType === 'prescription') return medicine.category === "전문 의약품";
        return true;
      });

  // 정렬 기준에 따라 결과 정렬
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name, 'ko');
      case 'effect':
        return a.effect.localeCompare(b.effect, 'ko');
      case 'company':
        return a.company.localeCompare(b.company, 'ko');
      default:
        return 0;
    }
  });

  // 검색 결과 수 업데이트
  useEffect(() => {
    setTotalResults(sortedResults.length);
  }, [sortedResults.length]);

  // 드롭다운 외부 클릭 시 닫기
  const handleClickOutside = () => {
    setShowTypeDropdown(false);
    setShowSortDropdown(false);
  };

  const getTypeLabel = () => {
    switch (selectedType) {
      case 'all': return '전체';
      case 'general': return '일반 의약품';
      case 'prescription': return '전문 의약품';
      default: return '전체';
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name': return '제품명';
      case 'effect': return '성분명';
      case 'company': return '제약회사';
      default: return '제품명';
    }
  };

  // 현재 필터 상태 텍스트 생성
  const getFilterStatusText = () => {
    const typeText = selectedType === 'all' ? '' : `${getTypeLabel()} · `;
    const sortText = `${getSortLabel()} 순`;
    return `${typeText}${sortText}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" onClick={handleClickOutside}>
      <Header />
      <main className="flex-1 w-full mt-[64px]">
        <div className="max-w-7xl mx-auto w-full px-4">
          {/* 검색창 영역 */}
          <div className="sticky top-[64px] bg-gray-50 z-10">
            <SearchBar 
              initialQuery={query || ''} 
              showTabs={true}
              initialMode={mode === 'natural' ? 'natural' : 'keyword'}
            />
          </div>

          {/* 필터 영역 - 결과가 있을 때만 표시 */}
          {sortedResults.length > 0 && (
            <div className="flex justify-between items-center mb-6">
              {/* 검색 결과 정보 */}
              <div className="text-sm">
                <span className="text-gray-600">
                  총 <span className="font-medium text-gray-900">{totalResults}개</span>의 검색결과
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-600">{getFilterStatusText()}</span>
              </div>

              {/* 필터 버튼들 */}
              <div className="flex gap-4">
                {/* 의약품 구분 드롭다운 */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTypeDropdown(!showTypeDropdown);
                      setShowSortDropdown(false);
                    }}
                    className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center gap-2"
                  >
                    <span>구분: {getTypeLabel()}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setSelectedType('all');
                            setShowTypeDropdown(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                          전체
                        </button>
                        <button
                          onClick={() => {
                            setSelectedType('general');
                            setShowTypeDropdown(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                          일반 의약품
                        </button>
                        <button
                          onClick={() => {
                            setSelectedType('prescription');
                            setShowTypeDropdown(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                          전문 의약품
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 정렬 기준 드롭다운 */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSortDropdown(!showSortDropdown);
                      setShowTypeDropdown(false);
                    }}
                    className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center gap-2"
                  >
                    <span>정렬: {getSortLabel()}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setSortBy('name');
                            setShowSortDropdown(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                          제품명
                        </button>
                        <button
                          onClick={() => {
                            setSortBy('effect');
                            setShowSortDropdown(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                          성분명
                        </button>
                        <button
                          onClick={() => {
                            setSortBy('company');
                            setShowSortDropdown(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                          제약회사
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 검색 결과 목록 */}
          <div className="space-y-4">
            {sortedResults.length > 0 ? (
              sortedResults.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      {medicine.image ? (
                        <img
                          src={medicine.image}
                          alt={medicine.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <NoImage />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">명칭: {medicine.name}</p>
                          <p className="text-sm text-gray-600">구분: {medicine.category}</p>
                          <p className="text-sm text-gray-600">제약사: {medicine.company}</p>
                          <p className="text-sm text-gray-600">성분: {medicine.effect}</p>
                          <p className="text-sm text-gray-600">
                            효능: {medicine.symptoms.join(', ')}
                          </p>
                        </div>
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

          {/* 페이지네이션 - 결과가 있을 때만 표시 */}
          {sortedResults.length > 0 && (
            <div className="flex justify-center mt-8 gap-2">
              {/* 실제 구현 시에는 totalResults와 itemsPerPage를 기반으로 페이지 수 계산 필요 */}
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? 'bg-[#2BA89C] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-1 rounded bg-white text-gray-600 hover:bg-gray-100">
                &gt;
              </button>
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