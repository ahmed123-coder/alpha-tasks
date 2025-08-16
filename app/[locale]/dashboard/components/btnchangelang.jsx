'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageLinks() {
  const pathname = usePathname();

  // إزالة الـ locale القديم من الـ path
  const cleanPath = pathname.replace(/^\/(ar|en)/, '');

  return (
    <div className="flex gap-4">
      <Link
        href={`/ar${cleanPath}`}
        className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm text-sm font-medium flex items-center gap-1"
      >
        🇸🇦 <span>العربية</span>
      </Link>
      <Link
        href={`/en${cleanPath}`}
        className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm text-sm font-medium flex items-center gap-1"
      >
        🇺🇸 <span>English</span>
      </Link>
    </div>
  );
}
