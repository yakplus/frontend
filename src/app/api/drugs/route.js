import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const query = searchParams.get('q');
    const isAutocomplete = searchParams.get('autocomplete') === 'true';

    if (!type || !query) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8084';
    let endpoint;

    if (isAutocomplete) {
      endpoint = `/api/drugs/autocomplete/${type}?q=${encodeURIComponent(query)}`;
    } else {
      endpoint = `/api/drugs/search/${type}?q=${encodeURIComponent(query)}`;
    }

    const response = await fetch(`${backendUrl}${endpoint}`);
    
    if (!response.ok) {
      throw new Error('백엔드 서버 응답 오류');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('데이터를 가져오는데 실패했습니다:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 