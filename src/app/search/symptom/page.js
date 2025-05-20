'use client';

import { Suspense } from 'react';
import SearchPage from '../../../components/SearchPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage searchType="symptom" />
    </Suspense>
  );
} 