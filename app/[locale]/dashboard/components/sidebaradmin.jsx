'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const SidebarAdmin = () => {
  const router = useRouter();
  const t = useTranslations('SidebarAdmin');

  const menuItems = [
    { name: t('dashboard'), path: '/dashboard/admin' },
    { name: t('users'), path: '/dashboard/admin/users' },
    { name: t('tasks'), path: '/dashboard/admin/tasks' },
    { name: t('projects'), path: '/dashboard/admin/projects' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-[200px] bg-gray-900 text-white shadow-lg flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">
        {t('adminPanel')}
      </h2>
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => router.push(item.path)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarAdmin;
