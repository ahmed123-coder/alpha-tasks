'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import UserCard from '../../components/UserCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

const AdminDashboard = () => {
  const t = useTranslations('AdminDashboard'); // تحميل نصوص الصفحة
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

        if (data.user.role !== 'Admin') {
          router.push('/'); // أي دور غير Admin يعيد للصفحة الرئيسية
        }
      } catch (err) {
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
      } catch (err) {
        console.error('Error fetching all users:', err);
      }
    };

    fetchUser();
    fetchAllUsers();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{t('allUsers')}</CardTitle>
          <Button onClick={() => router.push('/dashboard/admin/users/new')}>
            {t('newUser')}
          </Button>
        </CardHeader>
      </Card>

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
  );
};

export default AdminDashboard;
