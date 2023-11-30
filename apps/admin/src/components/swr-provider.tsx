'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
}
