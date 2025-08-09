'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const SidebarAdmin = () => {
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard/admin' },
    { name: 'Users', path: '/dashboard/admin/users' },
    { name: 'Tasks', path: '/dashboard/admin/tasks' },
    { name: 'Projects', path: '/dashboard/admin/projects' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-[200px] bg-gray-900 text-white shadow-lg flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Admin Panel</h2>
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
