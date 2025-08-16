'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';

export default function MemberDashboardPage() {
  const t = useTranslations('MemberDashboardPage');
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const editStatusOfTask = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/task/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(t('statusUpdated'));
      router.refresh();
    } catch (err) {
      console.error('Error updating task status:', err);
      alert(t('statusUpdateError'));
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const me = res.data.user;

        if (me.role === 'Admin') router.push('/dashboard/admin');
        if (me.role === 'Invité') router.push('/dashboard');
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(t('errorFetchUser'));
      }
    };

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const [projectsRes, tasksRes] = await Promise.all([
          axios.get('http://localhost:3000/api/project/my', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/api/task/my', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProjects(projectsRes.data.projects || []);
        setTasks(tasksRes.data.tasks || []);
      } catch (err) {
        console.error(err);
        setError(t('errorFetchData'));
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
    fetchData();
  }, [router, t]);

  if (loading) return <p className="text-center mt-10 text-lg animate-pulse">{t('loading')}</p>;
  if (error)
    return (
      <Alert variant="destructive" className="my-10 max-w-lg mx-auto">
        {error}
      </Alert>
    );

  return (
    <main className="bg-gray-50 min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* عنوان الصفحة */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">{t('header')}</h1>
          <p className="text-gray-500 mt-2">{t('subHeader')}</p>
        </header>

        {/* قسم المشاريع */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('myProjects')}</h2>
          {projects.length === 0 ? (
            <div className="text-gray-500 text-center py-10 border border-dashed border-gray-300 rounded-xl">
              {t('noProjects')}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project._id}
                  className="hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{project.description || t('noDescription')}</p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>
                        📅 {t('dueDate')}: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : t('notSet')}
                      </p>
                      <p>
                        👑 {t('owner')}: {project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : t('notSet')}
                      </p>
                      <p>
                        👥 {t('members')}: {project.members?.map((m) => m.firstName).join(', ') || t('noMembers')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* قسم المهام */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('myTasks')}</h2>
          {tasks.length === 0 ? (
            <div className="text-gray-500 text-center py-10 border border-dashed border-gray-300 rounded-xl">
              {t('noTasks')}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <Card
                  key={task._id}
                  className="hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle>{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{task.description || t('noDescription')}</p>
                    <div className="space-y-1 text-sm text-gray-500 mb-4">
                      <p>
                        📅 {t('dueDate')}: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : t('notSet')}
                      </p>
                      <p>
                        📌 {t('status')}: <span className="font-medium">{task.status || t('notSet')}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['À faire', 'En cours', 'En révision', 'Terminé']
                        .filter((status) => status !== task.status)
                        .map((status) => (
                          <Button
                            key={status}
                            variant={
                              status === 'À faire'
                                ? 'secondary'
                                : status === 'En cours'
                                ? 'default'
                                : status === 'En révision'
                                ? 'warning'
                                : 'success'
                            }
                            size="sm"
                            onClick={() => editStatusOfTask(task._id, status)}
                          >
                            {status}
                          </Button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
