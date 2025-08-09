'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SidebarAdmin from '@/app/dashboard/components/sidebaradmin';
import TaskCard from '@/app/dashboard/components/TaskCard';

export default function AdminTasksPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const me = res.data.user;
        setUser(me);

        if (me.role === 'Membre') {
          router.push('/dashboard/Membre');
        } else if (me.role === 'Invité') {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('فشل في التحقق من المستخدم.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/task', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(res.data.tasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('فشل في جلب المهام.');
      }
    };

    fetchMe();
    fetchTasks();
  }, [router]);

  if (loading) return <p>جارٍ التحميل...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <SidebarAdmin />
      <h1 className="text-2xl font-bold mb-4">📋 المهام</h1>
      <div className="mb-4">
        <button
          onClick={() => router.push('/dashboard/admin/tasks/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + مهمة جديدة
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={() => router.push(`/dashboard/admin/tasks/edite/${task._id}`)}
          />
        ))}
      </div>
    </div>
  );
}
