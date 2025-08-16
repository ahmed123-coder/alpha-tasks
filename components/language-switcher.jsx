'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeLanguage = (locale) => {
    // Split current path and replace first segment with locale
    const segments = pathname.split('/');
    segments[1] = locale; // [locale] in app folder
    const newPath = segments.join('/');

    router.push(`${newPath}?${searchParams.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => changeLanguage('en')}>
        English
      </Button>
      <Button variant="outline" onClick={() => changeLanguage('ar')}>
        العربية
      </Button>
    </div>
  );
}
