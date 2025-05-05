'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NoImage from '@/components/NoImage';
import Link from 'next/link';

export default function DrugDetailPage() {
  const params = useParams();
  const drugId = params.id;
  
  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchDrugDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/drugs/search/detail/${drugId}`);
        if (!response.ok) {
          throw new Error('약품 정보를 불러오는 데 실패했습니다.');
        }
        
        const data = await response.json();
        setDrug(data.data);
      } catch (err) {
        console.error('약품 상세 정보 조회 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrugDetail();
  }, [drugId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">로딩 중...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !drug) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16 text-red-500">
            {error || '약품 정보를 찾을 수 없습니다.'}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 약품 전문/일반 구분
  const getEtcOtcName = (isGeneral) => {
    return isGeneral ? "일반의약품" : "전문의약품";
  };

  // 주의사항 키 값 추출
  const precautionKeys = drug.precaution ? Object.keys(drug.precaution) : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full mt-[64px]">
        <div className="max-w-5xl mx-auto w-full px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* 상단 영역: 약품 기본 정보 */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* 약품 이미지 */}
              <div className="w-full md:w-80 h-80 flex-shrink-0">
                {drug.imageUrl ? (
                  <img
                    src={drug.imageUrl}
                    alt={drug.drugName}
                    className="w-full h-full rounded-lg object-contain border border-gray-200"
                  />
                ) : (
                  <NoImage className="w-full h-full" />
                )}
              </div>

              {/* 약품 기본 정보 */}
              <div className="flex-1 space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">{drug.drugName}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">제약회사</span>
                      <span className="text-gray-700">{drug.company}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">품목기준코드</span>
                      <span className="text-gray-700">{drug.drugId}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">보관방법</span>
                      <span className="text-gray-700">{drug.storeMethod}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">의약품 구분</span>
                      <span className="text-gray-700">{getEtcOtcName(drug.isGeneral)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">허가일</span>
                      <span className="text-gray-700">{drug.permitDate}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">유효기간</span>
                      <span className="text-gray-700">
                        {drug.validTerm ? drug.validTerm : '정보 없음'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">취소일자</span>
                      <span className="text-gray-700">
                        {drug.cancelDate ? drug.cancelDate : '해당 없음'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">취소사유</span>
                      <span className="text-gray-700">
                        {drug.cancelName ? drug.cancelName : '해당 없음'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 성분 정보 */}
            {drug.materialInfo && drug.materialInfo.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold px-4 py-2 rounded-md mb-3 border-b border-gray-300 pb-2">
                  성분 정보
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">성분명</th>
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">분량</th>
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">단위</th>
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">총량</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {drug.materialInfo.map((material, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                            <Link
                              href={`/search/material?q=${encodeURIComponent(material.성분명)}&mode=keyword&type=material`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {material.성분명}
                            </Link>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{material.분량}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{material.단위}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{material.총량}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 상세 정보 섹션 */}
            <div className="border-t pt-6 space-y-6">
              {/* 효능효과 */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold px-4 py-2 text-[#2BA89C] rounded-md border-b border-gray-300 pb-2">
                  효능효과
                </h2>
                <div className="px-4 py-2 text-gray-700">
                  {drug.efficacy?.length > 0 ? (
                    <ul className="list-none pl-0 space-y-1">
                      {drug.efficacy.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>정보가 없습니다.</p>
                  )}
                </div>
              </div>

              {/* 용법용량 */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold px-4 py-2 text-[#2BA89C] rounded-md border-b border-gray-300 pb-2">
                  용법용량
                </h2>
                <div className="px-4 py-2 text-gray-700">
                  {drug.usage?.length > 0 ? (
                    <ul className="list-none pl-0 space-y-1">
                      {drug.usage.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>정보가 없습니다.</p>
                  )}
                </div>
              </div>

              {/* 주의사항 및 기타 정보 */}
              {precautionKeys.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-bold px-4 py-2 text-[#2BA89C] rounded-md border-b border-gray-300 pb-2">
                    주의사항
                  </h2>
                  {precautionKeys.map((key) => (
                    <div key={key} className="space-y-3">
                      <h3 className="text-md font-semibold px-4 py-2 text-gray-700">
                        {key}
                      </h3>
                      <div className="px-4 py-2 text-gray-700">
                        {drug.precaution[key]?.length > 0 ? (
                          <ul className="list-none pl-0 space-y-1">
                            {drug.precaution[key].map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>정보가 없습니다.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 