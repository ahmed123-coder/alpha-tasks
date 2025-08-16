'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import TaskCard from '../../components/TaskCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function AdminTasksPage() {
  const t = useTranslations('AdminTasksPage'); // استخدم المفتاح من ملف الترجمة
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
        setError(t('errorFetchUser'));
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
        setError(t('errorFetchTasks'));
      }
    };

    fetchMe();
    fetchTasks();
  }, [router, t]);

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
          <Button onClick={() => router.push('/dashboard/admin/tasks/new')}>
            {t('addNewTask')}
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => router.push(`/dashboard/admin/tasks/edite/${task._id}`)}
                onDeleteLocal={(deletedId) =>
                  setTasks(prev => prev.filter(t => t._id !== deletedId))
                }
              />
            ))
          ) : (
            <p className="text-gray-500">{t('noTasks')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
