// this page of admin dashboard 
// fetch me if role of user is admin is true but when role is member or guest redirect to home page
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import UserCard from '@/app/dashboard/components/UserCard';
import SidebarAdmin from '@/app/dashboard/components/sidebaradmin';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = response.data;
        setUser(data.user);
        console.log('User data:', data.user);
        if (data.user.role === 'Membre') {
          router.push('/dashboard/Membre');
        }
        if (data.user.role === 'Invité') {
          router.push('/dashboard');
        }
      }
     catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data.users);
      console.log('All users:', response.data.users);
    } catch (err) {
      console.error('Error fetching all users:', err);
    }
  };

    fetchUser();
    fetchAllUsers();
  }, [router]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <SidebarAdmin />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Welcome, {user?.firstName} {user?.lastName}</h2>
          <p>Your role: {user?.role}</p>
          <p>
            As an admin, you have full access to manage users, tasks, and projects.
          </p>
        </div>
      )}
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">👤 جميع المستخدمين</h2>
        <div className="mb-4">
          <button
            onClick={() => router.push('/dashboard/admin/users/new')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            إضافة مستخدم جديد
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onClick={() => router.push(`/dashboard/admin/users/edite/${user._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
