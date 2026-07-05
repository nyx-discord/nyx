'use client';

import '@/app/global.css';
import DefaultSearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: ReactNode }) {
  const mode = useMode();

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className={`${mode ? `${mode} ` : ''}flex flex-col min-h-screen`}>
        <RootProvider
          search={{
            SearchDialog: DefaultSearchDialog,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

function useMode(): string | undefined {
  const { slug } = useParams();
  return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
}
