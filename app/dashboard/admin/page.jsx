'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SidebarAdmin from '../components/sidebaradmin';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setUser(data.user);

        if (data.user.role === 'Invité') router.push('/dashboard');
        if (data.user.role === 'Membre') router.push('/dashboard/member');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <div className="ml-[200px] p-6">Loading...</div>;
  if (error) return <div className="ml-[200px] p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="flex">
      <SidebarAdmin />
      <main className="ml-[200px] p-6 flex-1 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
        {user && (
          <p className="text-lg">
            Hello, <span className="font-semibold">{user.firstName} {user.lastName}</span>
          </p>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
