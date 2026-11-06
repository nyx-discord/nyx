'use client';

import { useEffect } from 'react';
import { basePath } from '@/lib/site';

export default function Redirect() {
  useEffect(() => {
    window.location.replace(`${basePath}/use`);
  }, []);

  return null;
}
