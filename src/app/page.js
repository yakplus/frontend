'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';

// 스켈레톤 UI 컴포넌트
const SearchBarSkeleton = () => (
  <div className="w-full">
    {/* 검색 모드 선택 탭을 위한 스켈레톤 */}
    <div className="flex mb-4 border-b border-gray-200">
      <div className="px-8 py-3 w-20 bg-gray-100 animate-pulse rounded-md"></div>
      <div className="px-8 py-3 w-20 bg-gray-100 animate-pulse rounded-md ml-4"></div>
    </div>
    
    {/* 검색 입력 필드를 위한 스켈레톤 */}
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <div className="w-full h-[52px] rounded-lg bg-gray-100 animate-pulse"></div>
      </div>
      
      {/* 드롭다운 버튼을 위한 스켈레톤 */}
      <div className="w-[100px] h-[52px] bg-gray-100 animate-pulse rounded-lg"></div>
    </div>
  </div>
);

const SearchBar = dynamic(() => import('../components/SearchBar'), {
  ssr: false,
  loading: () => <SearchBarSkeleton />,
});

const MAX_RECENT_SEARCHES = 5; // 최대 저장할 최근 검색어 수

const displayTypes = {
  symptom: '증상',
  ingredient: '성분명',
  name: '약품명',
  natural: '자연어'
};

const Home = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchBarProps, setSearchBarProps] = useState({
    initialQuery: '',
    initialMode: 'natural',
    initialType: 'symptom'
  });
  const searchBarRef = useRef(null);
  const router = useRouter();

  // 최근 검색어 클릭 핸들러
  const handleRecentSearchClick = (searchItem) => {
    // 검색어 클릭 시 바로 검색 페이지로 이동
    if (searchItem.mode === 'natural') {
      router.push(`/search?q=${encodeURIComponent(searchItem.query)}&mode=${searchItem.mode}&type=natural`);
    } else {
      router.push(`/search/${searchItem.type}?q=${encodeURIComponent(searchItem.query)}&mode=${searchItem.mode}&type=${searchItem.type}`);
    }
  };

  // 최근 검색어 로드
  useEffect(() => {
    const savedSearches = sessionStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // 최근 검색어 삭제
  const removeSearch = (searchToRemove) => {
    const newSearches = recentSearches.filter(search => search.query !== searchToRemove.query);
    setRecentSearches(newSearches);
    sessionStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  // 모든 최근 검색어 삭제
  const clearAllSearches = () => {
    setRecentSearches([]);
    sessionStorage.removeItem('recentSearches');
  };

  const RecentSearches = () => {
    if (recentSearches.length === 0) return null;
  
    return (
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((searchItem, index) => (
            <div
              key={index}
              className="group flex items-center bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
            >
              <button
                onClick={() => handleRecentSearchClick(searchItem)}
                className="px-3 py-1.5 flex items-center gap-2"
              >
                {searchItem.query}
                <span className="text-xs text-gray-500">
                  {displayTypes[searchItem.type]}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSearch(searchItem);
                }}
                className="pr-2 pl-1 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-3 h-3 text-gray-500 hover:text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mt-20 mb-16 flex justify-center">
          <Image
            src="/logo.svg"
            alt="약플 로고"
            width={200}
            height={200}
            priority
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <SearchBar 
            ref={searchBarRef}
            key={JSON.stringify(searchBarProps)} 
            {...searchBarProps} 
          />
          
          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900">최근 검색어</h3>
                <button
                  onClick={clearAllSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  전체 삭제
                </button>
              </div>
              <RecentSearches />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
