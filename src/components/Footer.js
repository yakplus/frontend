'use client';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="text-center">
          <h3 className="text-gray-900 font-bold mb-2">YAK+</h3>
          <p className="text-gray-600 text-sm mb-4">
            더 나은 약품 정보를 위한 약품 검색 플랫폼, YAK+
            {/* 나에게 딱 맞는 약품 검색, YAK+ */}
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} YAK+. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 