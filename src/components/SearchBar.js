'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const SearchIcon = ({ color = '#2BA89C', onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 focus:outline-none"
    type="button"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm hover:opacity-80 transition-opacity`} 
         style={{ backgroundColor: color }}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 14L18 18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </button>
);

const SearchBar = ({ initialQuery = '', showTabs = true, initialMode = 'keyword' }) => {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState(initialMode);
  const [searchType, setSearchType] = useState('symptom');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoCompleteCache, setAutoCompleteCache] = useState({}); // 자동완성 결과 캐시
  const MAX_CACHE_SIZE = 100;

// 캐시 업데이트 헬퍼 함수
// (MAX_CACHE_SIZE를 초과하면 가장 오래된 것 삭제)
const updateCache = (prevCache, key, value) => {
  const newCache = { ...prevCache };
  newCache[key] = value;

  if (Object.keys(newCache).length > MAX_CACHE_SIZE) {
    const oldestKey = Object.keys(newCache)[0]; // 가장 먼저 들어간 키를 삭제
    delete newCache[oldestKey];
  }

  return newCache;
};

  const searchTypes = {
    symptom: '증상',
    company: '제조사',
    medicine: '약품명'
  };

  const getPlaceholder = () => {
    if (searchMode === 'natural') {
      return '예) 머리가 아프고 열이 나요 (20자 이내)';
    }
    
    switch (searchType) {
      case 'symptom':
        return '증상을 입력하세요';
      case 'company':
        return '제조사를 입력하세요';
      case 'medicine':
        return '약품명을 입력하세요';
      default:
        return '검색어를 입력하세요';
    }
  };


  // 자동완성 데이터를 가져오는 함수
  const fetchSuggestions = async (query, type) => {
    try {
      setIsLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8084';
      const url = `${backendUrl}/api/api/drugs/autocomplete/${type}?q=${encodeURIComponent(query)}`;
      
      console.log('자동완성 요청 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('자동완성 응답:', response);
      
      if (!response.ok) {
        throw new Error('자동완성 데이터를 가져오는데 실패했습니다.');
      }
      
      const data = await response.json();
      console.log('자동완성 데이터:', data);
      
      // 캐시 업데이트 - 기존 결과를 새로운 결과로 덮어씌움
      const cacheKey = `${type}:${query}`;
      const results = data.data.autoCompleteList || [];
      // setAutoCompleteCache(prev => {
      //   const newCache = { ...prev };
      //   newCache[cacheKey] = results; // 기존 키가 있으면 덮어씌움
      //   return newCache;
      // });
      // 캐시 무한정 커지지 않게 개수 체크하면서 추가 (MAX_CACHE_SIZE를 초과하면 가장 오래된 것 삭제)
      setAutoCompleteCache(prev => updateCache(prev, cacheKey, results));
      
      return results;
    } catch (error) {
      console.error('자동완성 에러:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // debounce된 자동완성 함수
  // const debouncedFetchSuggestions = useCallback(
  //   debounce(async (query, type) => {
  //     if (query === prevQuery) {
  //       console.log('같은 검색어, 요청 스킵:', query);
  //       return;
  //     }
  //     const results = await fetchSuggestions(query, type);
  //     setSuggestions(results.map(text => ({ text, category: searchTypes[type] })));
  //   }, 1000),
  //   [fetchSuggestions]
  // );

  // 포커스 상태가 변경될 때 실행
  // useEffect(() => {
  //   if (!isFocused) {
  //     setSuggestions([]);
  //     return;
  //   }

  //   // 포커스가 들어왔을 때 현재 검색어에 대한 캐시 확인
  //   const trimmedQuery = searchQuery.trim();
  //   if (searchMode === 'keyword' && trimmedQuery.length > 0) {
  //     const cacheKey = `${searchType}:${trimmedQuery}`;
  //     if (autoCompleteCache[cacheKey]) {
  //       console.log('포커스 시 캐시된 결과 사용:', cacheKey);
  //       setSuggestions(autoCompleteCache[cacheKey].map(text => ({ text, category: searchTypes[searchType] })));
  //     }
  //     // 포커스 시에는 API 요청을 보내지 않음
  //   }
  // }, [isFocused]);

  // // 검색어나 타입이 변경될 때 실행
  // useEffect(() => {
  //   if (!isFocused) return;

  //   const trimmedQuery = searchQuery.trim();
  //   if (searchMode === 'keyword' && trimmedQuery.length > 0) {
  //     const cacheKey = `${searchType}:${trimmedQuery}`;
  //     if (autoCompleteCache[cacheKey]) {
  //       console.log('검색어 변경 시 캐시된 결과 사용:', cacheKey);
  //       setSuggestions(autoCompleteCache[cacheKey].map(text => ({ text, category: searchTypes[searchType] })));
  //     } else {
  //       debouncedFetchSuggestions(trimmedQuery, searchType);
  //     }
  //   } else {
  //     setSuggestions([]);
  //   }
  // }, [searchQuery, searchType, searchMode, autoCompleteCache]);

  // useEffect(() => {
  //   if (!isFocused) return;
  //   const trimmedQuery = searchQuery.trim();
  //   if (searchMode === 'keyword' && trimmedQuery.length > 0) {
  //     const cacheKey = `${searchType}:${trimmedQuery}`;
  //     if (autoCompleteCache[cacheKey]) {
  //       console.log('검색어 변경 시 캐시된 결과 사용:', cacheKey);
  //       setSuggestions(autoCompleteCache[cacheKey].map(text => ({ text, category: searchTypes[searchType] })));
  //     } else if (trimmedQuery !== prevQuery) {
  //       console.log('검색어 변경 시 서버 재요청:', trimmedQuery);
  //       debouncedFetchSuggestions(trimmedQuery, searchType);
  //       setPrevQuery(trimmedQuery);
  //     }
  //   } else {
  //     setSuggestions([]);
  //   }
  // }, [searchQuery, searchType, searchMode, autoCompleteCache, isFocused, prevQuery]);

  // 검색어, 타입, 모드, 포커스 변화에 따라 자동완성 처리
  // useEffect(() => {
  //   if (!isFocused) return;
  
  //   const trimmedQuery = searchQuery.trim();
  //   if (searchMode === 'keyword' && trimmedQuery.length > 0) {
  //     const cacheKey = `${searchType}:${trimmedQuery}`;
  
  //     if (autoCompleteCache[cacheKey]) {
  //       console.log('검색어 변경 시 캐시 사용:', cacheKey);
  //       setSuggestions(autoCompleteCache[cacheKey].map(text => ({ text, category: searchTypes[searchType] })));
  //     } else {
  //       console.log('검색어 변경 시 서버 재요청:', trimmedQuery);
  //       debouncedFetchSuggestions(trimmedQuery, searchType);
  //     }
  //   } else {
  //     setSuggestions([]);
  //   }
  // }, [searchQuery, searchType, searchMode, autoCompleteCache, debouncedFetchSuggestions]);

  useEffect(() => {
    if (!isFocused) {
      setSuggestions([]);
      return;
    }
  
    const trimmedQuery = searchQuery.trim();
    const cacheKey = `${searchType}:${trimmedQuery}`;
  
    if (searchMode !== 'keyword' || trimmedQuery.length === 0) {
      setSuggestions([]);
      return;
    }
  
    if (autoCompleteCache[cacheKey]) {
      console.log('캐시 사용:', cacheKey);
      setSuggestions(autoCompleteCache[cacheKey].map(text => ({ text, category: searchTypes[searchType] })));
      return;
    }
  
    // 300ms 후에 서버 요청 예약
    const handler = setTimeout(() => {
      console.log('서버 요청:', trimmedQuery);
      fetchSuggestions(trimmedQuery, searchType)
        .then(results => {
          setSuggestions(results.map(text => ({ text, category: searchTypes[searchType] })));
        });
    }, 300);
  
    // 다음 입력 시 기존 요청 취소
    return () => clearTimeout(handler);
  
  }, [searchQuery, searchType, searchMode, isFocused, autoCompleteCache]);


  // 포커스 아웃 시 자동완성 닫기
  const handleBlur = () => {
    // 약간의 지연을 주어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  // 최근 검색어 저장 함수
  const saveRecentSearch = (query, type, mode) => {
    try {
      const savedSearches = sessionStorage.getItem('recentSearches');
      const searches = savedSearches ? JSON.parse(savedSearches) : [];
      
      const newSearch = {
        query: query.trim(),
        type: type,
        mode: mode
      };

      const filteredSearches = searches.filter(item => item.query !== newSearch.query);
      const updatedSearches = [newSearch, ...filteredSearches].slice(0, 5);
      
      sessionStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchMode === 'keyword') {
      switch (searchType) {
        case 'symptom':
          saveRecentSearch(searchQuery, searchType, searchMode);
          router.push(`/search/symptom?q=${encodeURIComponent(searchQuery)}`);
          break;
        case 'company':
          // 추후 구현
          break;
        case 'medicine':
          // 추후 구현
          break;
      }
    } else {
      // 자연어 검색 처리
      saveRecentSearch(searchQuery, 'natural', searchMode);
      // router.push(`/search/symptom?q=${encodeURIComponent(searchQuery)}&mode=natural`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (searchMode === 'natural' && value.length > 20) {
      return;
    }
    setSearchQuery(value);
    setSelectedSuggestion(-1);
  };

  const handleKeyDown = (e) => {
    if (searchMode === 'natural' && e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
      return;
    }

    if (!suggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          setSearchQuery(suggestions[selectedSuggestion].text);
          setSuggestions([]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedSuggestion(-1);
        break;
    }
  };

  // 검색어의 일치하는 부분을 하이라이트하는 함수
  const highlightMatch = (text) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={i} className="text-[#2BA89C] font-medium">{part}</span> : part
    );
  };

  // 선택된 모드에 따른 색상 테마
  const getThemeColor = () => {
    return searchMode === 'keyword' ? '#2BA89C' : '#2978F2';
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setSuggestions([]);
    if (searchType === 'symptom') {
      saveRecentSearch(suggestion.text, searchType, 'keyword');
      router.push(`/search/symptom?q=${encodeURIComponent(suggestion.text)}`);
    }
  };

  return (
    <div className="w-full">
      {/* 검색 모드 선택 탭 - showTabs가 true일 때만 표시 */}
      {showTabs && (
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`px-8 py-3 font-medium transition-all ${
              searchMode === 'keyword'
                ? 'text-[#2BA89C] border-b-2 border-[#2BA89C]'
                : 'text-gray-500 hover:text-[#2BA89C]'
            }`}
            onClick={() => {
              setSearchMode('keyword');
              setSearchQuery('');
            }}
          >
            키워드
          </button>
          <button
            className={`px-8 py-3 font-medium transition-all ${
              searchMode === 'natural'
                ? 'text-[#2978F2] border-b-2 border-[#2978F2]'
                : 'text-gray-500 hover:text-[#2978F2]'
            }`}
            onClick={() => {
              setSearchMode('natural');
              setSearchQuery('');
            }}
          >
            자연어
          </button>
        </div>
      )}

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-1 relative">
          <SearchIcon 
            color={getThemeColor()} 
            onClick={handleSearch}
          />
          <input
            type="text"
            placeholder={getPlaceholder()}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            maxLength={searchMode === 'natural' ? 20 : undefined}
            className={`w-full pl-16 pr-4 py-4 border rounded-lg focus:outline-none transition-all hover:shadow-md ${
              searchMode === 'keyword'
                ? 'border-[#2BA89C] focus:ring-2 focus:ring-[#2BA89C]/20'
                : 'border-[#2978F2] focus:ring-2 focus:ring-[#2978F2]/20'
            }`}
          />
          {searchMode === 'natural' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {searchQuery.length}/20
            </div>
          )}

          {/* 자동완성 드롭다운 */}
          {isFocused && searchMode === 'keyword' && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.text}
                  type="button"
                  onClick={() => {
                    handleSuggestionClick(suggestion);
                    setIsFocused(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-[#2BA89C]/5 transition-colors ${
                    index === selectedSuggestion ? 'bg-[#2BA89C]/10' : ''
                  }`}
                >
                  <div className="font-medium">
                    {highlightMatch(suggestion.text)}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 ml-2">
                    {suggestion.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 검색 유형 선택 드롭다운 (키워드 모드일 때만 표시) */}
        {searchMode === 'keyword' && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-full px-6 py-4 bg-white border border-[#2BA89C] rounded-lg text-gray-700 hover:bg-[#2BA89C]/5 focus:outline-none focus:ring-2 focus:ring-[#2BA89C]/20 flex items-center gap-2 transition-all"
            >
              {searchTypes[searchType]}
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {Object.entries(searchTypes).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setSearchType(type);
                      setIsDropdownOpen(false);
                      setSuggestions([]);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-[#2BA89C]/5 transition-colors ${
                      searchType === type ? 'text-[#2BA89C] font-medium bg-[#2BA89C]/10' : 'text-gray-700'
                    } ${type === 'medicine' ? 'rounded-b-lg' : ''} ${
                      type === 'symptom' ? 'rounded-t-lg' : ''
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </form>

      {/* 자동완성 결과 */}
      {searchQuery && !isLoading && autoCompleteCache[`${searchType}:${searchQuery}`] && autoCompleteCache[`${searchType}:${searchQuery}`].length > 0 && (
        <div className="absolute z-10 w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-200">
          {/* ... existing autocomplete results code ... */}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 