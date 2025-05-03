const NoImage = ({ className = "" }) => {
  return (
    <div className={`w-full h-full bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 약병 몸체 */}
          <rect 
            x="7" 
            y="8" 
            width="10" 
            height="12" 
            rx="1" 
            strokeWidth="1.5" 
            stroke="#9CA3AF" 
            fill="none" 
          />
          
          {/* 약병 뚜껑 */}
          <path 
            d="M8 8v-2c0-0.6 0.4-1 1-1h6c0.6 0 1 0.4 1 1v2" 
            strokeWidth="1.5" 
            stroke="#9CA3AF" 
            fill="none" 
          />
          
          {/* 약병 라벨 */}
          {/* <rect 
            x="8" 
            y="10" 
            width="8" 
            height="4" 
            rx="0.5" 
            strokeWidth="1" 
            stroke="#9CA3AF" 
            fill="none" 
          /> */}
          
          {/* X 표시 - 우측 하단으로 이동 및 크기 확대 */}
          {/* <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 15L13 21M13 15l6 6" 
            stroke="#EF4444"
          /> */}
        </svg>
        <p className="mt-1 text-xs text-gray-500">약품 이미지 준비 중</p>
      </div>
    </div>
  );
};

export default NoImage; 