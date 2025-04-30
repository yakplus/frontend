'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NoImage from '@/components/NoImage';

// 약품 상세 정보 Mock 데이터
const mockDrugData = {
  "etc_otc_code": "0",
  "item_permit_date": "1955-04-12",
  "item_seq": "195500005",
  "ee_doc_data": [
    "탈수증, 수술전후 등의 수분ㆍ전해질 보급",
    "에너지 보급"
  ],
  "entp_name": "제이더블유중외제약(주)",
  "img_url": "",
  "item_name": "중외5%포도당생리식염액(수출명:5%DextroseinnormalsalineInj.)",
  "material_name": [
    {
      "성분명": "포도당",
      "분량": "50",
      "단위": "그램",
      "총량": "1000밀리리터",
      "규격": "USP",
      "비고": "",
      "성분정보": ""
    },
    {
      "성분명": "염화나트륨",
      "분량": "9",
      "단위": "그램",
      "총량": "1000밀리리터",
      "규격": "KP",
      "비고": "",
      "성분정보": ""
    }
  ],
  "nb_doc_data": {
    "1. 경고": [
      "포도당 함유제제를 정맥주사하는 환자는 치아민(비타민 B1) 소모율이 높기 때문에 순간적으로 치명적인 치아민 결핍을 초래할 가능성이 있다."
    ],
    "2. 다음 환자에는 투여하지 말 것.": [
      "1) 수분과다상태 환자",
      "2) 저장성 탈수증 환자",
      "3) 저칼륨혈증 환자",
      "4) 고나트륨혈증 환자"
    ],
    "3. 다음 환자에는 신중히 투여할 것.": [
      "1) 신질환에서 기인한 신부전 환자",
      "2) 심부전 환자",
      "3) 고장성 탈수증 환자",
      "4) 폐쇄성 요로질환에 의한 요량감소가 있는 환자",
      "5) 당뇨병 환자",
      "6) 고염소혈증 환자",
      "7) 저나트륨혈증(120 mmol/L 미만) 환자"
    ],
    "4. 이상반응": [
      "1) 대량ㆍ급속투여에 의해 뇌부종, 폐부종, 말초부종, 산증, 수중독이 나타날 수 있다.",
      "2) 신생아, 미숙아에 급속투여(시간당 100mL 이상)하는 경우 수중독이 나타날 수 있다.",
      "3) 주입정맥에서 혈전증이 나타날 수 있다."
    ],
    "5. 일반적 주의": [
      "혈당, 혈청 전해질, 체액 평형을 정기적으로 모니터링해야 한다."
    ],
    "6. 임부, 수유부, 가임여성, 신생아, 유아, 소아, 고령자에 대한 투여": [
      "1) 이 의약품의 용기는 가소제로 Di-(2-EthylHexyl)Phthalate(DEHP)를 사용한 PVC 재질로서 DEHP는 어린 동물을 이용한 시험에서 수컷 생식기의 발달 및 정자형성에 영향을 미친다는 보고가 있습니다. 이러한 PVC 용기의 경우 DEHP가 극미량 용출될 수 있으나 DEHP에 노출되어 나타나는 위험성은 없거나 거의 없습니다. 따라서 이 의약품을 사용하지 않아서 발생할 수 있는 위험성은 DEHP에 의하여 우려되는 위험성보다 훨씬 크기 때문에 사용을 기피할 필요는 없습니다.(DEHP를 사용한 PVC재질의 용기에 한함)",
      "2) 임신 중 투여에 대한 안전성이 확립되지 않았으므로 치료상의 유익성이 태아에 대한 잠재적 위해성을 상회한다고 판단되는 경우에만 투여한다.",
      "3) 분만 중에 포도당을 함유한 용액을 정맥 투여할 경우, 산모에게 고혈당증을 초래할 수 있으며, 신생아의 반동저혈당증 뿐만 아니라, 태아의 고혈당증 및 대사성 산증을 일으킬 수 있다. 태아의 고혈당증은 태아의 인슐린 수치를 증가시킬 수 있으며, 이는 출산 후 신생아 저혈당증을 초래할 수 있다. 해당 약물을 투여하기 전에 환자에 대한 유익성과 위해성을 고려해야 한다.",
      "4) 신생아(특히 조산아나 저체중아의 경우)는 저혈당증 또는 고혈당증의 위험이 높아진다. 그러므로 잠재적인 장기간 부작용을 피하기 위한 적절한 혈당 조절을 할 수 있도록 면밀한 모니터링이 필요하다. 신생아의 저혈당증은 발작, 혼수, 뇌손상을 초래할 수 있다. 고혈당증은 뇌실내출혈, 박테리아 및 곰팡이 감염의 후기발병, 미숙아의 망막병증, 괴사성창자큰창자염, 기관지폐이형성증, 입원기간의 연장 및 사망과 관련된다.",
      "5) 유아 및 고령자에게는 급속 또는 장시간 투여해서는 안된다.",
      "6) 고령자에 투여시 특히 중증 심부전 및 신부전 환자에게는 순환과부하를 피하기 위해 주의하여 투여하여야 한다."
    ],
    "7. 과량투여시의 처치": [
      "이뇨제를 투여하여야 한다."
    ],
    "8. 적용상의 주의": [
      "1) 투여전",
      "(1) 투여전에 감염에 대한 처치를 한다(환자의 피부나 기구 소독).",
      "(2) 한랭기에는 체온정도로 따뜻하게 하여 사용한다.",
      "(3) 개봉 후 즉시 사용하고, 잔액은 사용하지 않는다."
    ],
    "9. 보관 및 취급상의 주의사항": [
      "실온에서 보관한다."
    ]
  },
  "storage_method": "밀봉용기",
  "ud_doc_data": [
    "보통 성인 1일 500～1,000mL를 2～3회 나누어 점적 정맥주사한다.",
    "투여속도는 시간당 250～500mL(분당 60～120방울)이고, 영ㆍ유아의 경우 시간당 15～60mL(분당 4～15방울), 고령자의 경우 시간당 250mL(분당 60방울)로 한다.",
    "투여량, 투여속도는 연령, 체중, 증상에 따라 적절히 증감한다."
  ],
  "valid_term": "제조일로부터 36 개월,제조일로부터 18 개월"
};

export default function DrugDetailPage() {
  const params = useParams();
  const drugId = params.id;
  
  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API 개발이 완료되면 아래 주석을 해제하고 mock 데이터 대신 실제 API를 사용하면 됩니다.
    
    const fetchDrugDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/api/drugs/search/detail/${drugId}`);
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
    
    
    // Mock 데이터 사용
//     setTimeout(() => {
//       setDrug({
//         ...mockDrugData,
//         item_seq: drugId, // URL의 ID 반영
//       });
//       setLoading(false);
//     }, 500); // 로딩 효과를 위한 지연 시간
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
                      <span className="text-gray-700">{getEtcOtcName(drug.isGeneral)} / {drug.isHerbal ? '한약' : '양약'}</span>
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
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">규격</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {drug.materialInfo.map((material, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{material.성분명}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{material.분량}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{material.단위}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{material.총량}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{material.규격}</td>
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