'use client';

import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          {/* <Image
            src="/logo.svg"
            alt="Yak+ Logo"
            width={32}
            height={32}
            priority
          /> */}
          <span className="text-[#2978F2] font-bold text-xl">YAK<span className="text-[#40CDB9]">+</span></span>
        </Link>

        {/* 건강 문구 */}
        {/* <div className="flex items-center">
          <div className="overflow-hidden">
            <p className="text-gray-600 font-medium mr-2 flex items-center">
              {'당신의 건강한 하루를 응원합니다'.split('').map((char, i) => (
                <span 
                  key={i} 
                  className="inline-block transition-transform hover:text-[#40CDB9]"
                  style={{
                    animation: `smoothWave 3s infinite`,
                    animationDelay: `${i * 0.05}s`,
                    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </p>
          </div>
          
        </div> */}
      </div>

      <style jsx>{`
        @keyframes smoothWave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </header>
  );
};

export default Header; 