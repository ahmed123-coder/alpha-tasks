'use client';
import React from 'react';
import LanguageLinks from './components/btnchangelang';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <main className=" p-6 flex-1 bg-gray-100 min-h-screen">
        <header className="p-4 bg-gray-100 flex justify-end">
          <LanguageLinks />
        </header>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
