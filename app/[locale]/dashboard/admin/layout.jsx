'use client';
import React from 'react';
import SidebarAdmin from '../components/sidebaradmin';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <SidebarAdmin />
      <main className="ml-[200px] p-6 flex-1 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
